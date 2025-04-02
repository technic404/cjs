const BaseReader = require("../../../common/readers/BaseReader");

const ECMAModuleHelper = {
    /**
     * Provides regions that are string expressions, also removes from this expressions the js templates
     * @example
     * return `Abc ${a + b}`
     * // Will provide [{ start: 0, end: 6 }, { start: 11, end: 12 }]
     * @param {string} content 
     * @returns {{ start: number, end: number }[]}
     */
    getTextRegions(content) {
        const reader = new BaseReader(content)
        reader.stringChars.push("`");
     
        const exclude = {
            regions: [],
            region: { start: -1, end: -1 }
        }
     
        const jsTemplate = {
            opened: false,
            nestedOpeningBrackets: 0,
            content: "",
        }
     
        reader._read((char, i, matchNextChars) => {
            const { loop } = reader;
        
            const openRegion = () => {
                const isReadingRegion = exclude.region.start !== -1;
        
                if(isReadingRegion) {
                    exclude.region.end = i;
                    return;
                }
        
                exclude.region.start = i;
                exclude.region.end = i;
            }
        
            const closeRegion = (addToEnd = 0) => {
                exclude.region.end += 2 + addToEnd;
                exclude.regions.push(Object.assign({}, exclude.region));
                exclude.region = { start: -1, end: -1 };
            }
        
            const isJsTemplateArea = loop.string.opened && loop.string.openingChar === '`';
     
            if(jsTemplate.opened) {
                jsTemplate.content += char;
            }
    
            if(jsTemplate.opened && char === "{" && content[i - 1] !== '$') {
                jsTemplate.nestedOpeningBrackets += 1;
            }
     
            if(jsTemplate.opened && isJsTemplateArea && char === "}") {
                if(jsTemplate.nestedOpeningBrackets > 0) {
                    jsTemplate.nestedOpeningBrackets -= 1;
                    return;
                }
            }
     
            if(matchNextChars(`\${`) && isJsTemplateArea && !jsTemplate.opened) {
                jsTemplate.opened = true;
                closeRegion(1);
                loop.skipChars += 1;
                return;
            }
        
            if(matchNextChars("}") && jsTemplate.opened && isJsTemplateArea) {
                const jsTemplateContentLength = jsTemplate.content.length;
                const jsTemplateRegions = getTextRegions(jsTemplate.content).map(region => {
                    const indexAddDiff = i - jsTemplateContentLength + 1;
                    return { start: region.start + indexAddDiff, end: region.end + indexAddDiff }
                });
                exclude.regions.push(...jsTemplateRegions);
                jsTemplate.opened = false;
                jsTemplate.content = '';
                openRegion();
                return;
            }
        
            if(loop.string.opened && !jsTemplate.opened) {
                openRegion();
            }
     
            if(!loop.string.opened && exclude.region.start !== -1 && exclude.region.end !== -1 && !jsTemplate.opened) {
                closeRegion();
            }
        });
     
        return exclude.regions;
    },
    /**
     * Returns javascript identifiers from file
     * @param {string} content
     * @param {string} identifier
     * @returns {{ start: number, end: number }[]}
     */
    getIdentifiers(content, identifier) {

        const exclude = this.getTextRegions(content);
        const regex = new RegExp(`\\b${identifier}\\b(?!:)`, "g");
        const ranges = [];
        const illegalCharsBefore = [
            "@", "#", "$", "]", "}", "\\", ";", "'", '"', "`", ".",
        ];
        const illegalCharsAfter = [
            "@", "#", "$", "{", "\\", "'", '"', "`", /*","*/,
        ];
        // const illegalChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=", "[", "]", "{", "}", "|", "\\", ";", ":", "'", "\"", "`", ".", ",", "<", ">", "/", "?"]
        let match;

        const isInExcludeRegion = (start, end) => {
            for(const excludeRegion of exclude) {
                const isInRange = start >= excludeRegion.start && end <= excludeRegion.end
                
                if(isInRange) return true;
            }
    
            return false;
        }

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

            const start = match.index;
            const end = match.index + identifier.length - 1

            if(!isInExcludeRegion(start, end)) {
                ranges.push({
                    start, end
                });
            }
        }

        // // Debug visualisation of text exclude regions
        // if(content.includes("Some content here...")) {
        //     let cp = content;

        //     for(const range of exclude) {
        //         cp = cp.slice(0, range.start) + "#".repeat(range.end - range.start) + cp.slice(range.end);
        //     }

        //     console.log(cp);
        // }

        return ranges;
    },
    /**
     * Returns all exported variables present in string (js file)
     * @param {String} content
     * @returns {Array<{ name: string, varName: "const"|"let"|"var"|"class"|"function"|"async"|"{}", start; number, end: number, exportKeywordStart: number }>}
     */
    getExports(content) {
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
    },
    /**
     * Returns all imports present in js file
     * @param {String} content
     * @returns {Object.<string, { name: { source: string, target: string }, start: number, end: number, content: string }[]>}
     */
    getImports(content) {
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
    },
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
    mergeImportStatements(jsCode) {
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
    },
    /**
     * Removes javascript comments with tolerance in string comments
     * @param {String} content 
     * @returns {String}
     */
    removeComments(content) {
        // 1) replace "/" in quotes with non-printable ASCII '\1' char
        content.replace(/("([^\\"]|\\")*")|('([^\\']|\\')*')/g, (m) => m.replace(/\//g, '\\1'))

        // 2) clear comments
        content.replace(/(\/\*[^*]+\*\/)|(\/\/[^\n]+)/g, '')
        
        // 3) restore "/" in quotes
        content.replace(/\1/g, '/')

        return content;
    },
    /**
     *
     * @param {String} content
     * @returns {String} removed comments, merged import statements
     */
    getParsedContent(content) {
        let parsed = content
            .split("\n")
            .map((line) => `    ${line}`)
            .join("\n");

        parsed = this.removeComments(parsed);
        parsed = this.mergeImportStatements(parsed);

        return parsed;
    },
    /**
     * If for example paths are:
     * 
     * `..\src\requests\channels\ProductRequests.mjs`
     * 
     * `..\src\requests\AppRequests.mjs`
     * 
     * The result will contain the cutted version like that
     * 
     * `channels\ProductRequests.mjs`, `AppRequests.mjs`
     * 
     * @param {string} path1 
     * @param {string} path2 
     * @returns {{ path1: string, path2: string }}
     */
    cutOffFirstRepeatedPath(path1, path2) {
        const minLength = Math.min(path1.length, path2.length);
        let commonIndex = 0;
    
        for (let i = 0; i < minLength; i++) {
            if (path1[i] !== path2[i]) break;

            commonIndex++;
        }
    
        if (commonIndex > 0) {
            const remainingPath1 = path1.substring(commonIndex);
            const remainingPath2 = path2.substring(commonIndex);
    
            return { path1: remainingPath1, path2: remainingPath2 };
        } else {
            return { path1, path2 };
        }
    }
}

module.exports = ECMAModuleHelper;