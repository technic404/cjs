const fs = require('fs');
const { getSchematic, ElementTypes } = require('../schematic');

/**
 * 
 * @param {String} path
 * @param {{pascalCase: string, camelStyle: string}} namings 
 */
function createStyle(path, namings) {
    const schematic = getSchematic(namings, ElementTypes.STYLE);

    if(!fs.existsSync(path)) { fs.writeFileSync(path, schematic); }
}

module.exports = createStyle;