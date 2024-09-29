const fs = require('fs');
const path = require('path');
const Constants = require("../Constants");
const ECMAModuleHelper = require('./ECMAModuleHelper');
const { getRecursivelyDirectoryFiles, slashesToBackslashes, getCombinedPath } = require("./utils/fileUtil");
const { getRandomCharacters, cutOffTextFromString, insertTextAtIndex, removeTooManyNewLines } = require("./utils/stringUtil");
const { PrefixError, Colors } = require('../../defaults');
const IndexHeadReader = require('./IndexHeadReader');

const JavaScriptMerger = {
    getWorkerData(input) {
        const directory = input;
        const files = getRecursivelyDirectoryFiles(directory, ".mjs");
        const map = new Map(); // fileUrl, functionName
        let mergedContent = ``;

        for (const file of files) {
            const fileMethodName = getRandomCharacters(16);
            const namings = {
                setUpFunctionName: `${Constants.ModuleSetterPrefix}${path.basename(file).replace(".mjs", "")}${fileMethodName}`,
                varName: path.basename(file).replace(".mjs", "") + fileMethodName,
            };
    
            mergedContent += `var ${namings.varName} = {}; \n`;
    
            map.set(file, namings);
        }

        for (const file of files) {
            /**
             * @type {{setUpFunctionName: string, varName: string}}
             */
            const namings = map.get(file);
    
            // Append compressor prefix
            const fileStartLogic = {
                checkIfInitialized: `    if(Object.keys(${namings.varName}).length > 0) return ${namings.varName};`,
                exportStatement: `    const ${Constants.ExportVariableName} = {};`,
            };
    
            mergedContent += `const ${namings.setUpFunctionName} = () => {\n${fileStartLogic.checkIfInitialized}\n\n${fileStartLogic.exportStatement}\n\n`;
    
            // File content
            const content = fs.readFileSync(file, { encoding: "utf-8" });
            let parsed = ECMAModuleHelper.getParsedContent(content);
    
            // File exports, supported exports -> export const variableName = "variableValue"; or export {variable1, variable2};
            let exports = ECMAModuleHelper.getExports(parsed);
    
            // File imports, supported imports -> import { SomeFile } from "./path/to/SomeFile.mjs";
            let imports = ECMAModuleHelper.getImports(parsed);
    
            while (exports.length !== 0) {
                const element = exports[0];
                const exportCutRanges = {
                    start: element.exportKeywordStart,
                    end: element.start + element.name.length + (element.varName === "{}" ? 1 : 0),
                };
    
                const nextExportChar = parsed.substring(
                    exportCutRanges.end,
                    exportCutRanges.end + 1
                );
    
                // support for "export {}" and "export {};"
                if (nextExportChar === "}") {
                    exportCutRanges.end += 2;
                }
    
                // Cut off the export, like: export or export {
                parsed = cutOffTextFromString(
                    parsed,
                    exportCutRanges.start,
                    exportCutRanges.end
                );
    
                // If export is like: export { variable1, variable2 };
                const isMultiExport = element.varName.startsWith("{");
    
                // Transformation details
                // real: "function myFunction"
                // transformed: __export["myFunction"]
                // example: __export["myFunction"] = function myFunction ...
                const transformation = {
                    real: `${element.varName} ${element.name}`,
                    transformed: `${Constants.ExportVariableName}["${element.name}"]`,
                };
    
                // When the case is:
                // class Person { constructor() {  }; getName() { return "defaultName"; } }
                // __export["Person"] = Person;
                //
                // __export["myFunction"] = function myFunction() { return "coolValue"; }
                //
                // __export["myAsyncFunction"] = async function myAsyncFunction() { return await fetch("https://google.com"); }
                const isReversedTransformation = ["class", "function", "async"].includes(
                    element.varName
                );
    
                if (isReversedTransformation) {
                    const isClass = "class" === element.varName;

                    if(isClass) {
                        const findEndIndexOfTheClassLastBracket = () => {
                            let openingBracketsNumber = 0;
                            let iter = 1;

                            while(true) {
                                if(openingBracketsNumber === 0 && iter !== 1) break;

                                const char = parsed[element.exportKeywordStart + iter];

                                if(char === "{") openingBracketsNumber++;

                                if(char === "}") openingBracketsNumber--;

                                iter++;
                            }

                            return element.exportKeywordStart + iter;
                        }

                        const classEndIndex = findEndIndexOfTheClassLastBracket();

                        // Inserts after the class declaration
                        // __export["ClassName"] = ClassName;
                        parsed = insertTextAtIndex(
                            parsed,
                            classEndIndex,
                            `\n\n    ${transformation.transformed} = ${element.name};`
                        )

                        // Inserts before the class content { constructor() {} getName() { return "something"; } }
                        // class ClassName
                        parsed = insertTextAtIndex(
                            parsed,
                            element.exportKeywordStart,
                            `${element.varName} ${element.name}`
                        )
                    } else {
                        
                        parsed = insertTextAtIndex(
                            parsed,
                            element.exportKeywordStart,
                            `${transformation.transformed} = ${transformation.real}`
                        );
                    }
                } else if (isMultiExport) {
                    // Contains names of the exported elements
                    // export { variable1, function1, class1 }
                    // result will be ["variable1", "function1", "class1"]
                    const exportedVars = element.name.split(",").map((e) => e.trim());
    
                    exportedVars.forEach((exportedVar) => {
                        // Transformation method for multi exports
                        // example: __export["variable1"] = variable1;
                        parsed = insertTextAtIndex(
                            parsed,
                            element.exportKeywordStart,
                            `${Constants.ExportVariableName}["${exportedVar}"] = ${exportedVar}\n    `
                        );
                    });
                } else {
                    // Examples of standard transformation:
                    // const variable1 = __export["variable1"] = "some value of variable1";
                    // let variable2 = __export["variable2"] = "some value of variable2";
                    // var variable3 = __export["variable3"] = "some value of variable3"
                    parsed = insertTextAtIndex(
                        parsed,
                        element.exportKeywordStart,
                        `${transformation.real} = ${transformation.transformed}`
                    );
                }
    
                // Update exports
                exports = ECMAModuleHelper.getExports(parsed);
            }
    
            while (Object.keys(imports).length !== 0) {
                const keys = Object.keys(imports);
                const first = { importUrl: keys[0], values: imports[keys[0]] };
                const importPath = slashesToBackslashes(getCombinedPath(file, first.importUrl));
                const directoryWithBackslashes = slashesToBackslashes(directory);
                const parsedImportPath = slashesToBackslashes((importPath.startsWith(directoryWithBackslashes) ? "" : `${directoryWithBackslashes}\\`) + importPath);

                const notExistingImportedFile = !fs.existsSync(parsedImportPath);

                if(notExistingImportedFile) {
                    console.log(`${PrefixError}In ${file} there is an unknown import ${[parsedImportPath]}`);
                    process.exit();
                }

                const cuttedOffPaths = ECMAModuleHelper.cutOffFirstRepeatedPath(file, importPath);
                
                const isCircularDependency = Object.keys(
                        ECMAModuleHelper.getImports(
                            fs.readFileSync(parsedImportPath, { encoding: 'utf-8' })
                        )
                    ).filter(e => {
                        const parsed = {
                            e: slashesToBackslashes(e),
                            path1: slashesToBackslashes(cuttedOffPaths.path1)
                        };
    
                        return (
                            `.\\${parsed.e}` === parsed.path1 
                            || parsed.e === parsed.path1
                            || parsed.e === `.\\${parsed.path1}`
                        )
                    })
                    .length > 0
                
                if(isCircularDependency) {
                    console.log(`${PrefixError}Files ${Colors.red}${file}${Colors.none} and ${Colors.red}${importPath}${Colors.none} are circular dependencies. This can lead to 'RangeError: Maximum call stack size exceeded'. This is considered as a bad programming habit.`);
                }

                if (!map.has(parsedImportPath)) {
                    console.log(`${PrefixError}Cannot detect import path ${Colors.red}${importPath}${Colors.none} in file ${Colors.red}${file}${Colors.none}`);
                    process.exit();
                }
    
                /**
                 * @type {{varName: string, setUpFunctionName: string}}
                 */
                const namings = (
                    map.has(parsedImportPath) ?
                    map.get(parsedImportPath) :
                    { varName: 'undefined', setUpFunctionName: 'undefined' }
                );
    
                //const methodName = namings.varName;
                const firstElement = first.values[0];
    
                // Cutting off the import line, like: import { SomeFile } from "./path/to/SomeFile.mjs";
                parsed = cutOffTextFromString(
                    parsed,
                    firstElement.start,
                    firstElement.end + 1
                ); // cut off the import line
    
                first.values.forEach((element) => {
                    // Detecting the empty import, like: import { } from "./path/to/SomeFile.mjs";
                    const isEmptyImport = [" ", ""].includes(element.name.target.trim());
    
                    if (isEmptyImport) return;
    
                    let identifiers = ECMAModuleHelper.getIdentifiers(parsed, element.name.target);
    
                    while (identifiers.length !== 0) {
                        const insertText = `(${namings.setUpFunctionName}().${element.name.source})`;
                        const identifier = identifiers[0];
    
                        parsed = cutOffTextFromString(
                            parsed,
                            identifier.start,
                            identifier.end + 1
                        );
                        parsed = insertTextAtIndex(
                            parsed,
                            identifier.start,
                            insertText
                        );
    
                        identifiers = ECMAModuleHelper.getIdentifiers(parsed, element.name.target);
                    }
                });
    
                // Update imports
                imports = ECMAModuleHelper.getImports(parsed);
            }
    
            const fileEndLogic = {
                initVariable: `    ${namings.varName} = ${Constants.ExportVariableName};`,
                returnExportVariable: `   return ${Constants.ExportVariableName};`,
                closeScope: `}`,
            };
    
            parsed = removeTooManyNewLines(parsed);

            mergedContent += parsed;
            mergedContent += `\n\n${fileEndLogic.initVariable}\n\n${fileEndLogic.returnExportVariable}\n${fileEndLogic.closeScope}\n`;
        }

        const getParsedPath = (suffix) => {
            return (
                directory.startsWith("./") || directory.startsWith(".\\")
                 ? directory.replace("./", "").replace(".\\") 
                 : directory
                
                 + suffix
            ).replaceAll("/", `\\`)
        }

        const ECMAScriptsSources = IndexHeadReader.getECMAScriptsSources(fs.readFileSync("../index.html", { encoding: 'utf-8' }));
        
        for(const modulePath of ECMAScriptsSources) {
            const moduleParsedPath = getParsedPath(modulePath.startsWith("src/") ? modulePath.slice(3) : modulePath);

            if(!map.has(moduleParsedPath)) {
                console.log(`${PrefixError}Can't find the ${modulePath}, ${moduleParsedPath} file`);
                process.exit();
            }

            const moduleData = map.get(moduleParsedPath);

            mergedContent += `\n${moduleData.setUpFunctionName}();`;
        }

        return {
            content: mergedContent,
            map: map
        }
    }
}

module.exports = JavaScriptMerger;