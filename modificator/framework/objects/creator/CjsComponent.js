const { cjsConfig } = require("../../../constants");
const CjsElement = require("./CjsElement");

class CjsComponent extends CjsElement {
    fileNameSuffix = ".mjs";
    // fileNameSuffix = "Component.mjs";

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
        const tagNameTranslations = [
            "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", 
            "bdo", "blackquote", "button", "canvas", "caption", "cite", "code", "col", 
            "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", 
            "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form",
            "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "i", "iframe", "ins", "label", 
            "legend", "li", "main", "mark", "menu", "nav", "ol", "optgroup", "option", "output", "p",
            "param", "pre", "progress", "q", "script", "search", "section", "select", "small",
            "span", "strong", "style", "summary", "sub", "table", "tbody", "td", "template",
            "textarea", "tfoot", "th", "thead", "time", "title", "tr", "u", "ul", "video"
        ];

        const { creator } = config;
        const setHtmlTag = creator.autoSetTagNames && tagNameTranslations.includes(pascalCase.toLowerCase())
        const tagName = setHtmlTag
            ? pascalCase.toLowerCase()
            : "div"

        const className = !setHtmlTag && creator.autoAddClassNames
            ? ` class="${pascalCase.toLowerCase()}"`
            : ''

        const defaultText = creator.includeDefaultText
            ? `${pascalCase} component works!`
            : ''

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        content.push(`export const ${pascalCase} = new CjsComponent((data) => {`);

        if(creator.includeTopEmptyLine) {
            content.push(`    `);
        }

        content.push(`    return ${creator.stringReturnPrefix}\``);

        if(creator.createWithSplittedLines) {
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