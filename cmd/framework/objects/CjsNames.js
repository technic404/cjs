const { capitalizeFirst } = require("../utils/string");

/**
 * Converts pascal case to kebab case
 * @param {string} str 
 * @returns {string}
 */
function pascalToKebab(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')   // Handle normal case transitions
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2'); // Handle consecutive capitals
}

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
            pascalCase: capitalizeFirst(name, true),
            kebabCase: pascalToKebab(name).toLowerCase()
        };
    }
};

module.exports = CjsNames;