const { cjsConfig } = require('../constants');
const CjsCreator = require('./objects/CjsCreator');
const CjsLibrary = require('./objects/CjsLibrary');
const fs = require('fs');

class Cjs {

    /** @type {import('../types').Config} General config */
    #config;

    /** @type {string} Relative path to values set in config */
    #relative = `../`;

    /** @type {CjsLibrary} */
    library;

    /**
     * 
     * @param {import("../types").Config} config 
     */
    constructor(config) {
        this.#config = config;

        this.library = new CjsLibrary(this.#relative, this.#config);
        this.creator = new CjsCreator(this.#relative);
    }

    /**
     * Creates an empty project with default files
     */
    initEmptyProject() {
        this.#config = cjsConfig.getUser();

        fs.writeFileSync("../c.js", this.library.getContent(false));
        fs.cpSync("./framework/assets/defaultProject", this.#relative, { recursive: true });
    }
}

module.exports = Cjs;