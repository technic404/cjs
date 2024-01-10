const CjsElement = require("./CjsElement");

class CjsComponent extends CjsElement {
    fileNameSuffix = "Component.mjs";

    #imports = {
        handler: null,
        style: null
    }

    /**
     * Adds handler import statement to component content
     * @returns {CjsComponent}
     */
    supplyHandlerImport() {
        const { pascalCase } = this.names;

        this.#imports.handler = `import {${pascalCase}Handler as Handler} from "./${pascalCase}Handler.mjs";`;

        return this;
    }

    /**
     * Adds style import statement to component content
     * @param {string} path prefix path of the style source file
     * @returns {CjsComponent}
     */
    supplyStyleImport(path = "./src/components") {
        const { pascalCase, camelStyle } = this.names;

        this.#imports.style = `${pascalCase}Component.importStyle('${path}/${camelStyle}/${pascalCase}Style.css');`;

        return this;
    }

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        content.push(`export const ${pascalCase}Component = createComponent(\``)
        content.push(`    <div>${pascalCase}Component works!</div>`);
        content.push(`\`);`);

        if(this.#imports.style) content.push("\n" + this.#imports.style);

        return content.join("\n");
    }
}

module.exports = CjsComponent;