const { capitalizeFirst } = require("../utils/string");
const { PrefixError } = require("../../defaults");
const CjsComponent = require("./creator/CjsComponent");
const fs = require('fs');
const CjsHandler = require("./creator/CjsHandler");
const CjsStyle = require("./creator/CjsStyle");
const CjsLayout = require("./creator/CjsLayout");
const CjsPart = require("./creator/CjsPart");
const { cjsConfig } = require("../../constants");

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
        const isLayoutTree = cjsConfig.getUser().projectStructure.type === "layoutTree"

        if(isLayoutTree && (!("layout" in flags) || flags.layout === null) && element !== "layout" && element !== "component" && !("superGlobal" in flags)) {
            console.log(`${PrefixError}You have to provide layout flag using --layout`);

            return null;
        }

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
            const path = isLayoutTree && "layout" in flags
                ? `../src/layouts/${capitalizeFirst(flags.layout, false)}/components/${names.camelStyle}`
                : `../src/components/${names.camelStyle}`
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

            const path = (
                hasTargetFlag
                ? (
                    isLayoutTree
                    ? `../src/layouts/${capitalizeFirst(flags.layout, false)}/components/${capitalizeFirst(flags.target, false)}/${names.camelStyle}`
                    : `../src/components/${capitalizeFirst(flags.target, false)}/parts/${names.camelStyle}`
                )
                : (
                    !isLayoutTree || flags.superGlobal
                    ? `../src/parts/${names.camelStyle}`
                    : `../src/layouts/${capitalizeFirst(flags.layout, false)}/parts/${names.camelStyle}`
                )
            )

            const backwardsPath = (number) => {
                return path.split("/").slice(0, -1 * number).join("/")
            }

            const part = new CjsPart(names, path)
                .supplyHandlerImport()
                .supplyStyleImport();
            const handler = new CjsHandler(names, path);
            const style = new CjsStyle(names, path);

            if(isLayoutTree && !fs.existsSync(backwardsPath(2))) {
                console.log(`${PrefixError}Part cannot be created because layout with that name doesn't exists`);

                return null;
            }

            if(hasTargetFlag && !fs.existsSync(backwardsPath(1))) {
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