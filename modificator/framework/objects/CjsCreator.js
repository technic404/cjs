const { capitalizeFirst } = require("../utils/string");
const CjsComponent = require("./creator/CjsComponent");
const fs = require('fs');
const CjsHandler = require("./creator/CjsHandler");
const CjsStyle = require("./creator/CjsStyle");
const { PrefixError } = require("../../defaults");
const CjsLayout = require("./creator/CjsLayout");

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
     * @returns {CjsComponent|null}
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
            const handler = new CjsHandler(names, path);
            const style = new CjsStyle(names, path);
            const component = new CjsComponent(names, path)
                .supplyHandlerImport()
                .supplyStyleImport();

            if(fs.existsSync(component.getDirectory())) {
                console.log(`${PrefixError}Component directory already exists, cannot create component`)

                return null;
            }

            fs.mkdirSync(component.getDirectory(), { recursive: true })

            fs.writeFileSync(component.getFilePath(), component.getContent());
            fs.writeFileSync(handler.getFilePath(), handler.getContent());
            fs.writeFileSync(style.getFilePath(), style.getContent());

            return component;
        }

        if(element === "layout") {
            const path = `../src/layouts/${names.camelStyle}`;
            const layout = new CjsLayout(names, path);

            if(fs.existsSync(layout.getDirectory())) {
                console.log(`${PrefixError}Layout directory already exists, cannot create layout`)

                return null;
            }

            fs.mkdirSync(layout.getDirectory(), { recursive: true })

            fs.writeFileSync(layout.getFilePath(), layout.getContent());

            return layout;
        }

        if(element === "part") {

            return;
        }
    }
}

module.exports = CjsCreator;