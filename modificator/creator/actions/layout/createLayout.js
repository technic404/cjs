const fs = require('fs');
const { getSchematic, ElementTypes } = require('../schematic');

/**
 * 
 * @param {{pascalCase: string, camelStyle: string}} namings 
 */
function createLayout(namings) {
    const schematic = getSchematic(namings, ElementTypes.LAYOUT);
    const dir = `../src/${ElementTypes.LAYOUT}s/${namings.camelStyle}`;
    const paths = {
        base: `${dir}/${namings.pascalCase}Layout.mjs`,
    }

    if(!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }) }
    if(!fs.existsSync(paths.base)) { fs.writeFileSync(paths.base, schematic); }
}

module.exports = createLayout;