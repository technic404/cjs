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

        if(this.#imports.handler) content.push(this.#imports.handler + "\n");

        content.push(`export const ${pascalCase} = new CjsComponent((data) => {`)
        content.push(`    return \``)
        content.push(`        <div>${pascalCase} component works!</div>`);
        content.push(`    \`;`);
        content.push(`});`);

        if(this.#imports.style) content.push("\n" + this.#imports.style);

        return content.join("\n");
    }
}

module.exports = CjsComponent;