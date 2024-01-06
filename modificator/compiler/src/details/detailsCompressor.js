class DetailsCompressor {
    constructor(inputDirectory) {
        this.inputDirectory = inputDirectory
    }

    async getData() {
        let mergedContent = `/*\n Compressor details:\n`;

        const data = {
            "Date": new Date().toISOString(),
        }

        for(const [key, value] of Object.entries(data)) { mergedContent += ` • ${key}: ${value}\n`; }

        mergedContent += "*/";

        return {
            content: mergedContent
        }
    }
}

module.exports = DetailsCompressor;