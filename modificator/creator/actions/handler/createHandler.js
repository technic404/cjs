const fs = require('fs');
const { getSchematic, ElementTypes } = require('../schematic');

/**
 * 
 * @param {String} path
 * @param {{pascalCase: string, camelStyle: string}} namings 
 */
function createHandler(path, namings) {
    const schematic = getSchematic(namings, ElementTypes.HANDLER);

    if(!fs.existsSync(path)) { fs.writeFileSync(path, schematic); }
}

module.exports = createHandler;