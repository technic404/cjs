const CjsElement = require("./CjsElement");

class CjsLayout extends CjsElement {
    fileNameSuffix = "Layout.mjs";

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        content.push(`export const ${pascalCase}Layout = new CjsLayout(`)
        content.push(`    [`);
        content.push(`        `);
        content.push(`    ]`);
        content.push(`);`);

        return content.join("\n");
    }
}

module.exports = CjsLayout;