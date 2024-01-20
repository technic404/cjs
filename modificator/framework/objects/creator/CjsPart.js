const CjsElement = require("./CjsElement");

class CjsPart extends CjsElement {
    fileNameSuffix = "Part.mjs";

    #imports = {
        handler: null,
        style: null
    }

    /**
     * Adds handler import statement to component content
     * @returns {CjsPart}
     */
    supplyHandlerImport() {
        const { pascalCase } = this.names;

        this.#imports.handler = `import {${pascalCase}Handler as Handler} from "./${pascalCase}Handler.mjs";`;

        return this;
    }

    /**
     * Adds style import statement to component content
     * @returns {CjsPart}
     */
    supplyStyleImport() {
        const { pascalCase, camelStyle } = this.names;

        this.#imports.style = `${pascalCase}Part.importStyle('${this.semiAbsolutePath}/${pascalCase}Style.css');`;

        return this;
    }

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        content.push(`export const ${pascalCase}Part = new CjsPart(\``)
        content.push(`    <div>${pascalCase}Part works!</div>`);
        content.push(`\`);`);

        if(this.#imports.style) content.push("\n" + this.#imports.style);

        return content.join("\n");
    }
}

module.exports = CjsPart;