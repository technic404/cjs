class CjsElement {
    /**
     * @type {"Style.css"|"Component.mjs"|"Handler.mjs"}
     */
    fileNameSuffix = "";

    /**
     * 
     * @param {import("../../../types").CjsCreatorNames} names 
     * @param {string} directory 
     */
    constructor(names, directory) {
        this.names = names;
        this.directory = directory;
    }

    /**
     * Provides directory where the element contents are located
     * @returns {string}
     */
    getDirectory() { return this.directory; }

    /**
     * Provides file path (directory + file name)
     * @returns {string}
     */
    getFilePath() { return `${this.directory}/${this.names.pascalCase}${this.fileNameSuffix}` }

    /**
     * Provides text content of the element
     * @returns {string}
     */
    getContent() {}
}

module.exports = CjsElement;