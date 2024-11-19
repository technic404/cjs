const Constants = require("../Constants");
const fs = require('fs');
const { getRecursivelyDirectoryFiles } = require("./utils/fileUtil");
const { getRandomCharacters } = require("./utils/stringUtil");
const { removeEmptyNewLines } = require("../../framework/utils/string");
const { addPrefixToSelectors } = require("../../../common/utils/StyleUtil");

const StyleCreator = {
    getStyleData(input) {
        const files = getRecursivelyDirectoryFiles(`${input}`, ".css");
        const map = new Map();
        const parts = [];

        for(const file of files) {
            const parsedFilePath = file.replaceAll("\\", "/")

            const isInAssetsFolder = parsedFilePath.startsWith(`${input}/assets`);

            if(isInAssetsFolder) continue;

            const prefix = `${Constants.StyleClassPrefix}${getRandomCharacters(Constants.StyleClassIdHashLength)}`;
            const content = fs.readFileSync(file, { encoding: 'utf-8' }).replaceAll("`", "\`");
            const prefixed = addPrefixToSelectors(content, `[${prefix}]`);

            map.set(parsedFilePath, { prefix });

            parts.push(prefixed);
        }

        return {
            content: removeEmptyNewLines(parts.join("\n")),
            map: map
        }
    }
}

module.exports = StyleCreator;