const { cjsConfig, htmlClosingTags } = require("../../../constants");
const CjsElement = require("./CjsElement");

class CjsComponent extends CjsElement {
    fileNameSuffix = ".mjs";

    /** @type {{ handler: string|null, style: string|null }} */
    #imports = {
        handler: null,
        style: null
    }

    /**
     * Adds style import statement to component content
     * @returns {CjsComponent}
     */
    supplyStyleImport() {
        const { pascalCase } = this.names;

        this.#imports.style = `${this.semiAbsolutePath}/_styles/${pascalCase}.css`;

        return this;
    }

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        const config = cjsConfig.getUser();

        const { creator } = config;
        const setHtmlTag = creator.autoSetTagNames && htmlClosingTags.includes(pascalCase.toLowerCase())
        const tagName = setHtmlTag
            ? pascalCase.toLowerCase()
            : "div"

        const className = !setHtmlTag && creator.autoAddClassNames
            ? ` class="${this.className}"`
            : ''

        const defaultText = creator.includeDefaultText
            ? `${pascalCase} component works!`
            : ''

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        content.push(
            `export const ${pascalCase} = new class ${pascalCase} extends CjsComponent {`,
            `    data = {};`,
            ``,
            `   _() {`,
        );

        for(let i = 0; i < creator.topEmptyLines; i++) {
            content.push(`    `);
        }

        content.push(
            `       const {} = this._renderData;`,
            ``,
            `       return ${creator.stringReturnPrefix}\``
        );

        if(creator.createWithSplitLines) {
            content.push(`          <${tagName}${className}>`);
            content.push(`              ${defaultText}`);
            content.push(`          </${tagName}>`);
        } else {
            content.push(`          <${tagName}${className}>${defaultText}</${tagName}>`);
        }

        content.push(
            ...([
            `       \`;`,
            `   }`,
            ``,
            `    /** Settings */`,
            `    _renderData = this.data;`,
            (this.#imports.style ? `    _cssStyle = '${this.#imports.style}';` : null),
            `};`
            ].filter(e => e !== null))
        );

        return content.join("\n");
    }
}

module.exports = CjsComponent;