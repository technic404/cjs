const CjsElement = require("./CjsElement");

class CjsStyle extends CjsElement {
    fileNameSuffix = ".css";

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        content.push(`/* Style for ${pascalCase} */`);

        return content.join("\n");
    }
}

module.exports = CjsStyle;