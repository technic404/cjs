const { capitalizeFirst, getUpperCaseIndexes, isUpperCase } = require("../utils/string");
const { PrefixError } = require("../../defaults");
const CjsComponent = require("./creator/CjsComponent");
const fs = require('fs');
const CjsStyle = require("./creator/CjsStyle");
const CjsLayout = require("./creator/CjsLayout");
const CjsNames = require("./CjsNames");

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
        const names = CjsNames.getNames(name, element);
        const hasDirFlat = "dir" in flags && flags.dir !== null;

        if(element === "component") {
            const { pascalCase } = names;
            const hasLayoutFlag = "layout" in flags && flags.layout !== null;
            const path = hasLayoutFlag
                ? `../src/layouts/${hasDirFlat ? `${flags.dir}/` : ''}${capitalizeFirst(flags.layout, false)}`
                : `../src/components${hasDirFlat ? `/${flags.dir}` : ''}`
            const upperCaseIndexes = getUpperCaseIndexes(pascalCase);
            const isWholeUpper = upperCaseIndexes.length === pascalCase.length;
            const className = isWholeUpper
                ? pascalCase
                : pascalCase.split("").map((char, index) => {
                    const isFirst = index === 0;

                    if(isUpperCase(char) && !isFirst) {
                        return `-${char}`;
                    }

                    return char;
                }).join("").toLowerCase();

            const style = new CjsStyle(names, path + "/styles", className);
            const component = new CjsComponent(names, path, className)
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
            const path = `../src/layouts/${hasDirFlat ? `${flags.dir}/` : ''}${names.camelStyle.toLowerCase()}`;
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