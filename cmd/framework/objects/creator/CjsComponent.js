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

        const DataTypedef = `${pascalCase}Data`;

        // content.push(`/** @typedef {{  }} ${DataTypedef} */\n`);

        content.push(
            `/**`,
            ` * @typedef {Object} ${DataTypedef}`,
            ` */`,
            ``
        );

        content.push(
            `/** @type {CjsComponent<${DataTypedef}>} */`,
            `export const ${pascalCase} = new class CjsComponent {`,
            // `${this._tab(1)}/** @type {${DataTypedef}} */`,
            `${this._tab(1)}data = {};`,
            ``,
            `${this._tab(1)}_() {`,
        );

        content.push(`${this._tab(2)}const {  } = this._renderData;`);

        for(let i = 0; i < creator.topEmptyLines; i++) {
            content.push(this._tab(1));
        }

        content.push(`${this._tab(2)}return ${creator.stringReturnPrefix}\``);

        if(creator.createWithSplitLines) {
            content.push(`${this._tab(3)}<${tagName}${className}>`);
            content.push(`${this._tab(4)}${defaultText}`);
            content.push(`${this._tab(3)}</${tagName}>`);
        } else {
            content.push(`${this._tab(3)}<${tagName}${className}>${defaultText}</${tagName}>`);
        }

        content.push(
            ...([
                `${this._tab(2)}\`;`,
                `${this._tab(1)}}`,
                ``,
                `${this._tab(1)}/** Settings */`,
                `${this._tab(1)}_renderData = this.data;`,
                (this.#imports.style ? `${this._tab(1)}_cssStyle = '${this.#imports.style}';` : null),
                `};`
            ].filter(e => e !== null))
        );

        return content.join("\n");
    }
}

module.exports = CjsComponent;