const { cjsConfig } = require("../../../constants");
const CjsElement = require("./CjsElement");

class CjsStyle extends CjsElement {
    fileNameSuffix = ".css";

    getContent() {
        const { camelStyle } = this.names;
        const content = [];

        if(cjsConfig.getUser().creator.autoAddClassNames) {
            content.push(`.${camelStyle} {`);
            content.push(`    `);
            content.push(`}`);
        }

        return content.join("\n");
    }
}

module.exports = CjsStyle;