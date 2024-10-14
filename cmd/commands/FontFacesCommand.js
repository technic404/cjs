const Command = require("../Command");
const { Prefix } = require("../defaults");
const CjsFontFaces = require("../framework/objects/modifier/CjsFontFaces");

module.exports = class FontFacesCommand extends Command {
    constructor() {
        super("fontfaces", async (args, flags) => {
            const fontFiles = CjsFontFaces.getFontFiles();
            const isSuccess = CjsFontFaces.appendFontFaces(fontFiles);

            if(!isSuccess) return;

            console.log(`${Prefix}Successfully created font faces from ${fontFiles.length} files`);
        });
    }
}