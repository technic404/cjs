const { cjsConfig, htmlClosingTags } = require("../../../constants");
const CjsElement = require("./CjsElement");

class CjsStyle extends CjsElement {
    fileNameSuffix = ".css";

    getContent() {
        const { camelStyle, pascalCase } = this.names;
        const content = [];

        const { autoAddClassNames, autoSetTagNames } = cjsConfig.getUser().creator;

        if(autoAddClassNames || autoSetTagNames) {
            if(autoSetTagNames && htmlClosingTags.includes(pascalCase.toLowerCase())) {
                content.push(`${camelStyle.toLowerCase()} {`);
            // } else if(autoAddClassNames) {
            } else {
                content.push(`.${camelStyle.toLowerCase()} {`);
            }

            content.push(`    `);
            content.push(`}`);
        }

        return content.join("\n");
    }
}

module.exports = CjsStyle;