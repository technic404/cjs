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

        /**
         * Adds tabulator(s) spaces
         * @param {number} count
         * @returns {string}
         */
        const tab = (count) => "    ".repeat(count);

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        const DataTypedef = `${pascalCase}Data`;

        content.push(`/** @typedef {{  }} ${DataTypedef} */\n`);

        content.push(
            `export const ${pascalCase} = new class ${pascalCase} extends CjsComponent {`,
            `${tab(1)}/** @type {${DataTypedef}} */`,
            `${tab(1)}data = {};`,
            ``,
            `${tab(1)}_() {`,
        );

        content.push(`${tab(2)}const {  } = this._renderData;`);

        for(let i = 0; i < creator.topEmptyLines; i++) {
            content.push(tab(1));
        }

        content.push(`${tab(2)}return ${creator.stringReturnPrefix}\``);

        if(creator.createWithSplitLines) {
            content.push(`${tab(3)}<${tagName}${className}>`);
            content.push(`${tab(4)}${defaultText}`);
            content.push(`${tab(3)}</${tagName}>`);
        } else {
            content.push(`${tab(3)}<${tagName}${className}>${defaultText}</${tagName}>`);
        }

        content.push(
            ...([
                `${tab(2)}\`;`,
                `${tab(1)}}`,
                ``,
                `${tab(1)}/** Settings */`,
                `${tab(1)}_renderData = this.data;`,
                (this.#imports.style ? `${tab(1)}_cssStyle = '${this.#imports.style}';` : null),
                ``,
                `${tab(1)}/** Typedefs */`,
                `${tab(1)}/** @param {${DataTypedef}} data */ render(data);`,
                `${tab(1)}/** @param {${DataTypedef}} data */ visualise(data);`,
                `};`
            ].filter(e => e !== null))
        );

        return content.join("\n");
    }
}

module.exports = CjsComponent;