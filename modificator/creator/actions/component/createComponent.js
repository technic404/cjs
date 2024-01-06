const fs = require('fs');
const { getSchematic, ElementTypes } = require('../schematic');
const createHandler = require('../handler/createHandler');
const createStyle = require('../style/createStyle');

/**
 * 
 * @param {{pascalCase: string, camelStyle: string}} namings 
 */
function createComponent(namings) {
    const schematic = getSchematic(namings, ElementTypes.COMPONENT);
    const dir = `../src/${ElementTypes.COMPONENT}s/${namings.camelStyle}`;
    const paths = {
        base: `${dir}/${namings.pascalCase}Component.mjs`,
        style: `${dir}/${namings.pascalCase}Style.css`,
        handler: `${dir}/${namings.pascalCase}Handler.mjs`
    }

    if(!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }) }
    if(!fs.existsSync(paths.base)) { fs.writeFileSync(paths.base, schematic); }
    
    createStyle(paths.style, namings);
    createHandler(paths.handler, namings);
}

module.exports = createComponent;