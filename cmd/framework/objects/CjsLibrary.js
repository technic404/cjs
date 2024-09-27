const UglifyJS = require("uglify-js");
const fs = require('fs');
const { PrefixError } = require("../../defaults");

class CjsLibrary {

    /** @type {import('../../types').Config} General config */
    #config;

    /** @type {string} Relative path to values set in config */
    #relative;

    /** @type {string[]} List of framework source files */
    #scriptsOrder = [
        "utils/ConsoleColorsUtil.js", 
        "Constants.js", 
        "Runnable.js",
        "utils/StringUtil.js", 
        "utils/ElementUtil.js", 
        "utils/StyleUtil.js", 
        "utils/ArrayUtil.js", 
        "utils/NumericUtil.js", 
        "utils/SearchUtil.js", 
        "utils/public/CjsValidatorUtil.js", 
        "utils/public/CjsStringFormatterUtil.js", 
        "utils/public/CjsObjectsUtil.js", 
        "utils/public/CjsTimingsUtil.js", 
        "utils/public/CjsFiltersUtil.js", 
        "utils/public/CjsRequestsUtil.js", 
        "utils/public/CjsAssetsUtil.js", 
        "utils/public/CjsKeyFramesUtil.js", 
        "utils/public/CjsAnimationsUtil.js",
        "utils/public/CjsGlobalsUtil.js", 
        "utils/public/CjsWebSocket.js", 
        "utils/public/CjsHandler.js", 
        "helpers/AttributeHelper.js", 
        "objects/CjsHtmlElement.js", 
        "objects/CjsEvent.js", 
        "objects/CjsForm.js", 
        "objects/CjsComponent.js", 
        "objects/CjsLayout.js", 
        "objects/CjsComponentsCollection.js", 
        "events/common/ChangeEvent.js", 
        "events/common/ClickEvent.js", 
        "events/common/DoubleClickEvent.js", 
        "events/common/FocusEvent.js", 
        "events/common/FocusOutEvent.js", 
        "events/common/InputEvent.js", 
        "events/common/MouseEnterEvent.js", 
        "events/common/MouseLeaveEvent.js", 
        "events/common/MouseMoveEvent.js", 
        "events/common/TouchMoveEvent.js", 
        "events/custom/HoldDownEvent.js", 
        "events/custom/LoadEvent.js", 
        "events/custom/OuterClickEvent.js", 
        "events/custom/SlideDownEvent.js", 
        "events/custom/SlideLeftEvent.js", 
        "events/custom/SlideRightEvent.js", 
        "events/custom/SlideUpEvent.js", 
        "events/Off.js", 
        "FunctionMappings.js", 
        "listeners/ChangesObserverListener.js", 
        "DocumentRoot.js", 
        "Initializer.js",
        "utils/public/CjsShortcutsUtil.js",
        "plugins/CjsPlugin.js",
        "plugins/modules/CjsNotificationPlugin.js",
        "plugins/modules/CjsRipplePlugin.js",
        "plugins/modules/CjsScaleClickPlugin.js",
        "plugins/CjsPluginManager.js",
        "builders/CjsProgressBuilder.js",
    ]

    /**
     * @param {string} relative 
     * @param {import('../../types').Config} config 
     */
    constructor(relative, config) {
        this.#relative = relative;
        this.#config = config;
    }

    /**
     * Provides path of the library source folder (usually used on framework development)
     * @returns {string}
     */
    #getSourceFolderPath() {
        return this.#relative + this.#config.compiler.libraryPath;
    }

    getType() {
        const isFile = fs.statSync(this.#relative + this.#config.compiler.libraryPath).isFile();
        
        return isFile ? "file" : "directory";
    }

    /**
     * Provides path of the compiled library file
     * @returns {string}
     */
    #getCompiledFilePath() {
        return this.#relative + "c.js";
    }

    /**
     * Determinates if the framework source folder exists
     * @returns {boolean}
     */
    hasSourceFolder() {
        return fs.existsSync(this.#getSourceFolderPath());
    }

    /**
     * Determinates if the framework compiled library file exists
     * @returns {boolean}
     */
    hasCompiledFile() {
        return fs.existsSync(this.#getCompiledFilePath());
    }

    /**
     * Returns content of the framework compiled library file
     * @returns {boolean}
     */
    getCompiledFileContent() {
        return fs.readFileSync(this.#getCompiledFilePath(), { encoding: 'utf-8' });
    }

    /**
     * Prepares minified / unminified library content
     * @param {boolean} minifyScripts second param that determinates if script should be minified, by default is true but may be usefull when inniting a project so the jsdocs of library are kept
     * @returns {string} merged content of library folder
     */
    getContent(minifyScripts = true) {
        const libraryPath = this.#getSourceFolderPath();
        const content = this.hasSourceFolder()
            ? this.#scriptsOrder.map(path => {
                const fullPath = `${libraryPath}/${path}`;
                const pathExists = fs.existsSync(fullPath);
    
                if(!pathExists) {
                    console.log(`${PrefixError}The framework source file "${fullPath}" does not exists`);
                    return;
                }

                return fs.readFileSync(fullPath, { encoding: 'utf-8' });
            }).join("\n")
            : this.getCompiledFileContent()

        if(!this.hasCompiledFile() && !this.hasSourceFolder()) {
            console.log(`${PrefixError}Couldn't find the framework source folder or the compiled library file`);
            return null;
        }

        return this.#config.compiler.minifyScripts && minifyScripts
            ? UglifyJS.minify(content).code
            : content
        ;
    }
}

module.exports = CjsLibrary;