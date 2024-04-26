const fs = require('fs');
const path = require('path');
const { PrefixError } = require('../../../defaults');

const CjsFontFaces = {
    /** @return {string[]} */
    getFontFiles: () => {
        const fontsDirectory = "../src/assets/fonts";

        /** @returns {string[]} */
        const recursive = (directory) => {
            const files = [];

            if(!fs.existsSync(directory)) return files;

            fs.readdirSync(directory).forEach(file => {
                const filePath = path.join(directory, file);
                const isDirectory = fs.statSync(filePath).isDirectory();

                if(isDirectory) return files.push(...recursive(filePath));

                files.push(filePath);
            });

            return files;
        }

        return recursive(fontsDirectory);
    },
    /** 
     * @param {string[]} filePaths 
     * @returns {boolean} if success
     */
    appendFontFaces: (filePaths) => {
        const noFontFiles = filePaths.length === 0;

        if(noFontFiles) {
            console.log(`${PrefixError}No font files in ./src/assets/fonts`);
            return false;
        }

        const styleFile = "../src/assets/css/style.css";

        fs.appendFileSync(styleFile, "\n");

        for(const filePath of filePaths) {
            const extension = path.extname(filePath);
            const name = path.basename(filePath, extension);

            const fontFaceParts = [];

            fontFaceParts.push(`@font-face { font-family: ${name}; src: url("../fonts/${name}${extension}"); }`);

            fs.appendFileSync(styleFile, "\n" + fontFaceParts.join("\n"));
        }

        return true;
    }
}

module.exports = CjsFontFaces;