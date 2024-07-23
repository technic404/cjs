const { cjsConfig, htmlClosingTags } = require("../../../constants");
const CjsElement = require("./CjsElement");

class CjsComponent extends CjsElement {
    fileNameSuffix = ".mjs";

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

        this.#imports.style = `${pascalCase}.importStyle('${this.semiAbsolutePath}/styles/${pascalCase}.css');`;

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
            // ? ` class="${pascalCase.toLowerCase()}"`
            : ''

        const defaultText = creator.includeDefaultText
            ? `${pascalCase} component works!`
            : ''

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        content.push(`export const ${pascalCase} = new CjsComponent((data) => {`);

        for(let i = 0; i < creator.topEmptyLines; i++) {
            content.push(`    `);
        }

        content.push(`    return ${creator.stringReturnPrefix}\``);

        if(creator.createWithSplitLines) {
            content.push(`        <${tagName}${className}>`);
            content.push(`            ${defaultText}`);
            content.push(`        </${tagName}>`);
        } else {
            content.push(`        <${tagName}${className}>${defaultText}</${tagName}>`);
        }

        content.push(`    \`;`);
        content.push(`});`);

        if(this.#imports.style) content.push("\n" + this.#imports.style);

        return content.join("\n");
    }
}

module.exports = CjsComponent;