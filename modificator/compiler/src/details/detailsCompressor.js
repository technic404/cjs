class DetailsCompressor {
    constructor() { }

    async getData() {
        const content = [`/*\n Compressor details:\n`];

        const data = {
            "Date": new Date().toISOString(),
        }

        for(const [key, value] of Object.entries(data)) { content.push(` • ${key}: ${value}\n`); }

        content.push("*/");

        return {
            content: content.join("\n")
        }
    }
}

module.exports = DetailsCompressor;