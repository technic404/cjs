const fs = require('fs');

const ElementTypes = {
    COMPONENT: "component",
    PART: "part",
    LAYOUT: "layout",
    HANDLER: "handler",
    STYLE: "style"
}

/**
 *
 * @param {Object} nameObject
 * @param {String} nameObject.pascalCase
 * @param {String} nameObject.camelStyle
 * @param {$ElementType} elementType
 * @return {string}
 */
function getSchematic(nameObject, elementType) {
    return fs.readFileSync(`./actions/${elementType}/schematics/${elementType}.txt`, 'utf-8')
        .replaceAll("{PascalCase}", nameObject.pascalCase)
        .replaceAll("{CamelStyle}", nameObject.camelStyle);
}

module.exports = {
    getSchematic,
    ElementTypes: ElementTypes
}