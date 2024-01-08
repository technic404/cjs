const fs = require('fs');
const readConfig = require('../../../config/configReader');
const { cjs } = require('../../../lib');

/**
 * Returns javascript identifiers from file
 * @param {String} content
 * @param {String} identifier
 * @returns {{ start: number, end: number }[]}
 */
function getIdentifiers(content, identifier) {
    const regex = new RegExp(`\\b${identifier}\\b(?!:)`, "g");
    const ranges = [];
    const illegalCharsBefore = [
        "!", "@", "#", "$", "%", ")", "]", "}", "\\", ";", "'", '"', "`", ".", ",", "?",
    ];
    const illegalCharsAfter = [
        "!", "@", "#", "$", "%", "(", "[", "{", "\\", "'", '"', "`", /*","*/, "?",
    ];
    // const illegalChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=", "[", "]", "{", "}", "|", "\\", ";", ":", "'", "\"", "`", ".", ",", "<", ">", "/", "?"]
    let match;

    while ((match = regex.exec(content)) !== null) {
        const charBefore =
            match.index === 0
                ? null
                : content.substring(match.index - 1, match.index);
        const charAfter =
            match.end === content.length
                ? null
                : content.substring(match.end, match.end + 1);

        if (
            illegalCharsBefore.includes(charBefore) ||
            illegalCharsAfter.includes(charAfter)
        )
            continue;

        ranges.push({
            start: match.index,
            end: match.index + identifier.length - 1,
        });
    }

    return ranges;
}

/**
 * Returns all exported variables present in string (js file)
 * @param {String} content
 * @returns {Array<{ name: string, varName: "const"|"let"|"var"|"class"|"function"|"async"|"{}", start; number, end: number, exportKeywordStart: number }>}
 */
function getExports(content) {
    const regex = /(export\s+\{([^}]*)\};|export\s+\{([^}]*)\}|export\s+(?:const|let|var|class|function|async)\s+(\w+)|export\s+\{\})/g;

    const exports = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
        const exportKeyword = match[1];
        const exportedThing = match[2] || match[3] || match[4] || ""; // Use an empty string if the group is undefined
        const varName = match[0]
            .replace(match[3] !== undefined ? match[3] : match[4], "")
            .replace("export", "")
            .trim();
        const exportKeywordStart = match.index + match[0].indexOf(exportKeyword);
        const start = match.index + match[0].indexOf(exportedThing);
        const end = start + exportedThing.length;

        exports.push({
            name: exportedThing,
            varName,
            start,
            end,
            exportKeywordStart,
        });
    }

    return exports;
}

/**
 * Returns all imports present in js file
 * @param {String} content
 * @returns {Object.<string, { name: { source: string, target: string }, start: number, end: number, content: string }[]>}
 */
function getImports(content) {
    const regex = /import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']\s*;?/g;

    const imports = {};
    let match;

    while ((match = regex.exec(content)) !== null) {
        const importedItems = match[1].split(",").map((item) => item.trim());
        const filePath = match[2];
        const importRanges = [];
        const importStatement = match[0];
        const start = content.indexOf(importStatement, match.index);

        let end = start + importStatement.length - 1;

        const semicolonPresent = content
            .substring(end, end + 1)
            .replace(/\r\n\r/g, "")
            .trim() === ";";

        if (semicolonPresent) {
            end += 1;
        }

        for (const importedItem of importedItems) {
            const asSign = " as ";
            const hasImportAsSign = importedItem.includes(asSign); // import { Handler as CalendarHandler }

            importRanges.push({
                name: {
                    source: (hasImportAsSign ? importedItem.split(asSign)[0] : importedItem),
                    target: (hasImportAsSign ? importedItem.split(asSign)[1] : importedItem)
                },
                start,
                end,
                content: content.substring(start, end),
            });
        }

        if (imports[filePath]) {
            imports[filePath] = imports[filePath].concat(importRanges);
        } else {
            imports[filePath] = importRanges;
        }
    }

    return imports;
}

/**
 * Merges duplicated import statements, so if there is
 * 
 * `import { a } from "./b.js"`
 * 
 * `import { b } form "./b.js"`
 * 
 * the result will be:
 * 
 * `import { a, b } from "./b.js"`
 * 
 * @param {String} jsCode 
 * @returns {String}
 */
function mergeImportStatements(jsCode) {
    const importStatements = jsCode.match(/import\s*\{(.+?)\}\s*from\s*["']([^"']+)["']/g) || [];
    const importMap = {};

    importStatements.forEach((importStatement) => {
        const match = importStatement.match(/import\s*\{(.+?)\}\s*from\s*["']([^"']+)["']/);

        if (match) {
            const [, importSpecifiers, importPath] = match;
            const key = importPath.trim();

            if (!importMap[key]) {
                importMap[key] = [];
            }

            importMap[key].push(...importSpecifiers.split(",").map((specifier) => specifier.trim()));
        }
    });

    Object.entries(importMap).forEach(([importPath, specifiers]) => {
        const importSpecifierString = specifiers.join(", ");
        const mergedImportStatement = `import {${importSpecifierString}} from "${importPath}";`;

        jsCode = jsCode.replace(
            new RegExp(`import\\s*\\{.+?\\}\\s*from\\s*["']${importPath}["']\\s*;?`),
            mergedImportStatement
        );

        if (specifiers.length > 1) {
            specifiers.forEach((specifier) => {
                jsCode = jsCode.replace(`import {${specifier}} from "${importPath}";`, "");
            });
        }
    });

    return jsCode;
}

/**
 * Removes javascript comments with tolerance in string comments
 * @param {String} content 
 * @returns {String}
 */
function removeComments(content) {
    // 1) replace "/" in quotes with non-printable ASCII '\1' char
    content.replace(/("([^\\"]|\\")*")|('([^\\']|\\')*')/g, (m) => m.replace(/\//g, '\\1'))

    // 2) clear comments
    content.replace(/(\/\*[^*]+\*\/)|(\/\/[^\n]+)/g, '')
    
    // 3) restore "/" in quotes
    content.replace(/\1/g, '/')

    return content;
}

/**
 *
 * @param {String} content
 * @returns {String} removed comments, merged import statements
 */
function getParsedContent(content) {
    let parsed = content
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n");

    parsed = removeComments(parsed);
    parsed = mergeImportStatements(parsed);

    return parsed;
}

/**
 * 
 * @returns {string} merged file contents of cjs library
 */
function getFrameworkCompressedFiles() {
    const cjsScriptsOrder = [
        "utils/ConsoleColorsUtil.js", 
        "Constants.js", 
        "Runnable.js",
        "utils/StringUtil.js", 
        "utils/ElementUtil.js", 
        "utils/StyleUtil.js", 
        "utils/ArrayUtil.js", 
        "utils/NumericUtil.js", 
        "utils/public/CjsTimingsUtil.js", 
        "utils/public/CjsFiltersUtil.js", 
        "utils/public/CjsRequestsUtil.js", 
        "utils/public/CjsAssetsUtil.js", 
        "utils/public/CjsKeyFramesUtil.js", 
        "utils/public/CjsGlobalsUtil.js", 
        "utils/public/CjsWebSocket.js", 
        "ElementActions.js", 
        "helpers/AttributeReloader.js", 
        "builders/HtmlElementBuilder.js", 
        "builders/PartBuilder.js", 
        "builders/ComponentBuilder.js", 
        "builders/LayoutBuilder.js", 
        "FunctionMappings.js", 
        "listeners/ChangesObserverListener.js", 
        "helpers/ReferenceHelper.js", 
        "DocumentRoot.js", 
        "Initializer.js"
    ];

    const libraryPath = `../${readConfig().compiler.libraryPath}`;
    const isFile = cjs.getLibType() === "file";

    if(isFile) {
        return fs.readFileSync(libraryPath, { encoding: 'utf-8' });
    }

    let mergedContent = ``;

    for(const path of cjsScriptsOrder) {
        const fullPath = `${libraryPath}/${path}`;

        if(!fs.existsSync(fullPath)) continue;

        mergedContent += fs.readFileSync(fullPath, { encoding: 'utf-8' }) + "\n";
    }

    return mergedContent;
}

module.exports = {
    getIdentifiers,
    getExports,
    getImports,
    mergeImportStatements,
    removeComments,
    getParsedContent,
    getFrameworkCompressedFiles
}