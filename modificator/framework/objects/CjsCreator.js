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
     * @param {import("../../types").CjsCommandFlags} flags
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
            const hasLayoutFlag = "layout" in flags && flags.layout !== null;
            const path = hasLayoutFlag
                ? `../src/layouts/${capitalizeFirst(flags.layout, false)}`
                : `../src/${names.camelStyle}`
            const handler = new CjsHandler(names, path);
            const style = new CjsStyle(names, path + "/styles");
            const component = new CjsComponent(names, path)
                // .supplyHandlerImport()
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
            
            // fs.writeFileSync(handler.getFilePath(), handler.getContent());
            

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

        // TODO UPDATE PART TO REDUCE DIRS
        if(element === "part") {
            // const hasTargetFlag = "target" in flags && flags.target !== null;
            const hasTargetFlag = false;
            const hasLayoutFlag = "layout" in flags && flags.layout !== null;

            const path = (
                hasTargetFlag
                ? (
                    hasLayoutFlag
                    ? `../src/layouts/${capitalizeFirst(flags.layout, false)}/${capitalizeFirst(flags.target, false)}/${names.camelStyle}`
                    : `../src/components/${capitalizeFirst(flags.target, false)}/${names.camelStyle}`
                )
                : (
                    hasLayoutFlag
                    ? `../src/layouts/${capitalizeFirst(flags.layout, false)}`
                    : `../src/${names.camelStyle}`
                )
            )

            const backwardsPath = (number) => {
                return path.split("/").slice(0, -1 * number).join("/")
            }

            const part = new CjsPart(names, path)
                // .supplyHandlerImport()
                .supplyStyleImport();
            const handler = new CjsHandler(names, path);
            const style = new CjsStyle(names, path + "/styles");

            if(hasLayoutFlag && !fs.existsSync(backwardsPath(2))) {
                console.log(`${PrefixError}Part cannot be created because layout with that name doesn't exists`);

                return null;
            }

            if(hasTargetFlag && !fs.existsSync(backwardsPath(1))) {
                console.log(`${PrefixError}Part cannot be created because component with that name doesn't exists`);

                return null;
            }

            if(fs.existsSync(part.getFilePath())) {
                console.log(`${PrefixError}Part file path already exists, cannot create part`)
            } else {
                fs.mkdirSync(part.getDirectory(), { recursive: true });
                fs.writeFileSync(part.getFilePath(), part.getContent());
            }

            if(fs.existsSync(style.getFilePath())) {
                console.log(`${PrefixError}Style file path already exists, cannot create style`)
            } else {
                fs.mkdirSync(style.getDirectory(), { recursive: true });
                fs.writeFileSync(style.getFilePath(), style.getContent());
            }
            
            return part;
        }

        console.log(`${PrefixError}Got undefined element ${element}`);

        return null;
    }
}

module.exports = CjsCreator;