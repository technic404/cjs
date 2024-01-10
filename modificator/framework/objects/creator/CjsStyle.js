const CjsElement = require("./CjsElement");

class CjsStyle extends CjsElement {
    fileNameSuffix = "Style.css";

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        content.push(`/* Style for ${pascalCase}Component */`);

        return content.join("\n");
    }
}

module.exports = CjsStyle;