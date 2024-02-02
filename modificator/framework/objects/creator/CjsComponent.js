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
     * @returns {CjsComponent}
     */
    supplyStyleImport() {
        const { pascalCase } = this.names;

        this.#imports.style = `${pascalCase}Component.importStyle('${this.semiAbsolutePath}/${pascalCase}Style.css');`;

        return this;
    }

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        content.push(`export const ${pascalCase}Component = new CjsComponent((data) => \``)
        content.push(`    <div>${pascalCase}Component works!</div>`);
        content.push(`\`);`);

        if(this.#imports.style) content.push("\n" + this.#imports.style);

        return content.join("\n");
    }
}

module.exports = CjsComponent;