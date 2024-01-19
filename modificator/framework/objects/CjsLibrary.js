const UglifyJS = require("uglify-js");
const fs = require('fs');

class CjsLibrary {

    /** @type {import('../../types').Config} General config */
    #config;

    /** @type {string} Relative path to values set in config */
    #relative;

    #scriptsOrder = [
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
        // "builders/PartBuilder.js", 
        // "builders/ComponentBuilder.js", 
        "builders/CjsBuilderInterface.js", 
        "builders/CjsComponent.js", 
        "builders/CjsPart.js", 
        "builders/ComponentBuilder.js", 
        "builders/LayoutBuilder.js", 
        "FunctionMappings.js", 
        "listeners/ChangesObserverListener.js", 
        "helpers/ReferenceHelper.js", 
        "DocumentRoot.js", 
        "Initializer.js"
    ]

    /**
     * 
     * @param {string} relative 
     * @param {import('../../types').Config} config 
     */
    constructor(relative, config) {
        this.#relative = relative;
        this.#config = config;
    }

    getType() {
        const isFile = fs.statSync(this.#relative + this.#config.compiler.libraryPath).isFile();
        
        return isFile ? "file" : "directory";
    }

    /**
     * Prepares minified / unminified library content
     * @param {boolean} minifyScripts second param that determinates if script should be minified, by default is true but may be usefull when inniting a project so the jsdocs of library are kept
     * @returns {string} merged content of library folder / file
     */
    getContent(minifyScripts = true) {
        const libraryPath = this.#relative + this.#config.compiler.libraryPath;

        let content = this.getType() === "file" 
            ? fs.readFileSync(libraryPath, { encoding: 'utf-8' })
            : "";

        if(content.length === 0) {
            for(const path of this.#scriptsOrder) {
                const fullPath = `${libraryPath}/${path}`;
    
                if(!fs.existsSync(fullPath)) continue;
    
                content += fs.readFileSync(fullPath, { encoding: 'utf-8' }) + "\n";
            }
        }

        return (this.#config.compiler.minifyScripts && minifyScripts
            ? UglifyJS.minify(content).code
            : content
        );
    }
}

module.exports = CjsLibrary;