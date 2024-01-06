const fs = require('fs');
const { getSchematic, ElementTypes } = require('../schematic');
const createHandler = require('../handler/createHandler');
const createStyle = require('../style/createStyle');

/**
 * 
 * @param {{pascalCase: string, camelStyle: string}} namings 
 */
function createPart(namings, target = null) {
    const schematic = getSchematic(namings, ElementTypes.PART)
        .replace("{TargetComponentDirectory}", (
            target !== null ? `components/${target}/` : ""
        )); // placeholder
    
    const dir = `../src/${(target !== null ? `components/${target}/` : ``)}${ElementTypes.PART}s/${namings.camelStyle}`;
    const paths = {
        base: `${dir}/${namings.pascalCase}Part.mjs`,
        style: `${dir}/${namings.pascalCase}Style.css`,
        handler: `${dir}/${namings.pascalCase}Handler.mjs`
    }

    if(!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }) }
    if(!fs.existsSync(paths.base)) { fs.writeFileSync(paths.base, schematic); }
    
    createStyle(paths.style, namings);
    createHandler(paths.handler, namings);
}

module.exports = createPart;