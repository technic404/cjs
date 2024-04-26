const { capitalizeFirst } = require("../utils/string");

const CjsNames = {
    /**
     * Provies parsed names for user typed name input
     * @param {string} name 
     * @param {"layout"|"component"} element
     * @returns {import("../../types").CjsCreatorNames}
     */
    getNames: (name, element) => {
        const hasWrongEnding = name.toLowerCase().endsWith(element);

        if(hasWrongEnding) {
            name = name.substring(0, name.length - element.length);
        }

        return {
            camelStyle: capitalizeFirst(name, false),
            pascalCase: capitalizeFirst(name, true)
        };
    }
};

module.exports = CjsNames;