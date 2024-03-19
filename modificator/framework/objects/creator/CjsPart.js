const CjsElement = require("./CjsElement");

class CjsPart extends CjsElement {
    fileNameSuffix = ".mjs";

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

        this.#imports.style = `${pascalCase}.importStyle('${this.semiAbsolutePath}/styles/${pascalCase}.css');`;

        return this;
    }

    getContent() {
        const { pascalCase } = this.names;
        const content = [];

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");
        
        content.push(`export const ${pascalCase} = new CjsPart((data) => {`)
        content.push(`    return \``)
        content.push(`        <div>${pascalCase} part works!</div>`);
        content.push(`    \`;`);
        content.push(`});`);

        if(this.#imports.style) content.push("\n" + this.#imports.style);

        return content.join("\n");
    }
}

module.exports = CjsPart;