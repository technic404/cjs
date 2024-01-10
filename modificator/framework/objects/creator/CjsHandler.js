const CjsElement = require("./CjsElement");

class CjsHandler extends CjsElement {
    fileNameSuffix = "Handler.mjs";

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        content.push(`class Handler {`);
        content.push(`    constructor() { }`);
        content.push(`}`);
        content.push("");
        content.push(`export const ${pascalCase}Handler = new Handler();`)

        return content.join("\n");
    }
}

module.exports = CjsHandler;