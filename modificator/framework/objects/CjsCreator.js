const { capitalizeFirst } = require("../utils/string");
const { PrefixError } = require("../../defaults");
const CjsComponent = require("./creator/CjsComponent");
const fs = require('fs');
const CjsHandler = require("./creator/CjsHandler");
const CjsStyle = require("./creator/CjsStyle");
const CjsLayout = require("./creator/CjsLayout");
const CjsPart = require("./creator/CjsPart");

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
     * @param {{ target?: string }} flags
     * @returns {CjsComponent|CjsPart|CjsLayout|null}
     */
    create(element, name, flags = {}) {
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
            const path = `../src/layouts/`;
            const layout = new CjsLayout(names, path);

            if(fs.existsSync(layout.getFilePath())) {
                console.log(`${PrefixError}Layout file already exists, cannot create layout`)

                return null;
            }

            fs.mkdirSync(layout.getDirectory(), { recursive: true })

            fs.writeFileSync(layout.getFilePath(), layout.getContent());

            return layout;
        }

        if(element === "part") {
            const hasTargetFlag = "target" in flags && flags.target !== null;
            const targettedComponentPath = `../src/components/${capitalizeFirst(flags.target, false)}`;
            const path = hasTargetFlag
                ? `${targettedComponentPath}/parts/${names.camelStyle}`
                : `../src/parts/${names.camelStyle}`;
            const part = new CjsPart(names, path)
                .supplyHandlerImport()
                .supplyStyleImport();
            const handler = new CjsHandler(names, path);
            const style = new CjsStyle(names, path);

            if(hasTargetFlag && !fs.existsSync(targettedComponentPath)) {
                console.log(`${PrefixError}Part cannot be created because component with that name doesn't exists`);

                return null;
            }

            if(fs.existsSync(part.getDirectory())) {
                console.log(`${PrefixError}Part directory already exists, cannot create part`)

                return null;
            }

            fs.mkdirSync(part.getDirectory(), { recursive: true })

            fs.writeFileSync(part.getFilePath(), part.getContent());
            fs.writeFileSync(handler.getFilePath(), handler.getContent());
            fs.writeFileSync(style.getFilePath(), style.getContent());
            
            return part;
        }

        console.log(`${PrefixError}Got undefined element ${element}`);

        return null;
    }
}

module.exports = CjsCreator;