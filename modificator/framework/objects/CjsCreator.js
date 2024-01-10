const { capitalizeFirst } = require("../utils/string");
const CjsComponent = require("./creator/CjsComponent");
const fs = require('fs');
const CjsHandler = require("./creator/CjsHandler");

class CjsCreator {

    /** @type {string} Relative path to values set in config */
    #relative;

    constructor(relative) {
        this.#relative = relative;
    }

    /**
     * 
     * @param {"component"|"part"|"layout"} element 
     * @param {string} name 
     * @returns {CjsComponent}
     */
    create(element, name) {
        const hasWrongEnding = name.toLowerCase().endsWith(element);

        if(hasWrongEnding) {
            name = name.substring(0, name.length - element.length);
        }

        /**
         * @type {import("../../types").CjsCreatorNames}
         */
        const names = {
            camelStyle: capitalizeFirst(name, false),
            pascalCase: capitalizeFirst(name, true)
        };

        // TODO FINISH CREATOR

        if(element === "component") {
            const path = `../src/components/${names.camelStyle}`;
            const handler = new CjsHandler(names, path)
            const component = new CjsComponent(names, path)
                .supplyHandlerImport()
                .supplyStyleImport();

            if(fs.existsSync(component.getDirectory())) return null; // error, component exists

            fs.mkdirSync(component.getDirectory(), { recursive: true })

            fs.writeFileSync(component.getFilePath(), component.getContent());
            fs.writeFileSync(handler.getFilePath(), handler.getContent());

            return component;
        }

        if(element === "layout") {

            return;
        }

        if(element === "part") {

            return;
        }
    }
}

module.exports = CjsCreator;