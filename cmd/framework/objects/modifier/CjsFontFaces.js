const fs = require('fs');
const path = require('path');
const { PrefixError, Prefix } = require('../../../defaults');

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
     */
    appendFontFaces: (filePaths) => {
        const noFontFiles = filePaths.length === 0;

        if(noFontFiles) {
            return console.log(`${PrefixError}No font files in ./src/assets/fonts`);
        }

        const styleFile = "../src/assets/css/style.css";
        const styleFileContent = fs.readFileSync(styleFile, { encoding: "utf-8" });

        const endsWithNonEmptyLine = /(\r?\n)+$/.test(styleFile);

        if(endsWithNonEmptyLine) fs.appendFileSync(styleFile, "\n");

        console.log(`${Prefix}Successfully created font faces from files:`);

        for(const filePath of filePaths) {
            const extension = path.extname(filePath);
            const name = path.basename(filePath, extension);

            const fontFaceText = `@font-face { font-family: ${name}; src: url("../fonts/${name}${extension}"); }`;

            if(styleFileContent.includes(fontFaceText)) continue;

            fs.appendFileSync(styleFile, fontFaceText + "\n");

            console.log(` - ${name}${extension}`);
        }
    }
}

module.exports = CjsFontFaces;