const { capitalizeFirst } = require("../utils/string");
const { PrefixError } = require("../../defaults");
const CjsComponent = require("./creator/CjsComponent");
const fs = require('fs');
const CjsStyle = require("./creator/CjsStyle");
const CjsLayout = require("./creator/CjsLayout");

class CjsCreator {

    /** @type {string} Relative path to values set in config */
    #relative;

    constructor(relative) {
        this.#relative = relative;
    }

    /**
     * 
     * @param {"component"|"layout"} element 
     * @param {string} name 
     * @param {import("../../types").CjsCommandFlags} flags
     * @returns {CjsComponent|CjsLayout|null}
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
            const hasLayoutFlag = "layout" in flags && flags.layout !== null;
            const path = hasLayoutFlag
                ? `../src/layouts/${capitalizeFirst(flags.layout, false)}`
                : `../src/${names.camelStyle}`
            const style = new CjsStyle(names, path + "/styles");
            const component = new CjsComponent(names, path)
                .supplyStyleImport();

            if(fs.existsSync(component.getFilePath())) {
                console.log(`${PrefixError}Component file path already exists, cannot create component`)
            } else {
                fs.mkdirSync(component.getDirectory(), { recursive: true });
                fs.writeFileSync(component.getFilePath(), component.getContent());
            }

            if(fs.existsSync(style.getFilePath())) {
                console.log(`${PrefixError}Style file path already exists, cannot create style`);
            } else {
                fs.mkdirSync(style.getDirectory(), { recursive: true });
                fs.writeFileSync(style.getFilePath(), style.getContent());
            }

            return component;
        }

        if(element === "layout") {
            const path = `../src/layouts/${names.camelStyle}`;
            const layout = new CjsLayout(names, path);

            if(fs.existsSync(layout.getFilePath())) {
                console.log(`${PrefixError}Layout file already exists, cannot create layout`)

                return null;
            }

            fs.mkdirSync(layout.getDirectory(), { recursive: true })

            fs.writeFileSync(layout.getFilePath(), layout.getContent());

            return layout;
        }

        console.log(`${PrefixError}Got undefined element ${element}`);

        return null;
    }
}

module.exports = CjsCreator;