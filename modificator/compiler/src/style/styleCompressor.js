const fs = require('fs');
const { getRecursivelyDirectoryFiles } = require('../utils/fileUtil');
const { getRandomCharacters } = require('../utils/stringUtil');
const { startWebServer } = require('../server/app');
const readConfig = require('../../../config/configReader');

class StyleCompressor {
    constructor(inputDirectory) {
        this.inputDirectory = inputDirectory
    }

    async getData() {
        const files = getRecursivelyDirectoryFiles(`${this.inputDirectory}`, ".css");
        const map = new Map();

        let mergedContent = ``;
        let browserScriptContent = ``;

        for(const file of files) {
            const parsedFilePath = file.replaceAll("\\", "/")

            const isInAssetsFolder = parsedFilePath.startsWith(`${this.inputDirectory}/assets`);

            if(isInAssetsFolder) continue;

            const prefix = `x____cjs${getRandomCharacters(6)}`;
            const content = fs.readFileSync(file, { encoding: 'utf-8' }).replaceAll("`", "\`");
            
            browserScriptContent += `await fetch("/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileUrl: "${parsedFilePath}", prefix: "${prefix}", result: (await addPrefixToSelectors(\`${content}\`, "${prefix}")) }) })\ndocument.body.innerHTML += "<p>Request ${parsedFilePath} completed</p>";\n`
        }

        await startWebServer(readConfig().compiler.tempWebserverPort, browserScriptContent, (fileUrl, result, prefix) => {
            map.set(fileUrl, { prefix });

            const isEmpty = result.trim() === "";

            if(isEmpty) return;

            mergedContent += result + "\n";
        })

        return {
            content: mergedContent,
            map: map
        }
    }
}

module.exports = StyleCompressor;