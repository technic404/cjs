/** @DeleteOnJsFormat */ const BaseReader = require("./BaseReader");

class CssStylePropertiesReader extends BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "/*",
        closing: "*/",
        ignoreInString: true,
        singleLineEnabled: false,
    }

    /**
     * Css selector style
     * @param {string} css 
     */
    constructor(css) {
        super(css);
    }

    /**
     * Returns properties names and its values inside the css selector
     * @returns {Object.<string, string>}
     */
    read() {
        const replaceNewLines = (str) => { return str.replaceAll("\n", ""); }

        this.source = replaceNewLines(this.source);

        const properties = {};

        const tempProperty = {
            name: '', 
            value: '', 
            /** @type {"name"|"value"} */
            reading: 'name',
            _parse: () => {
                tempProperty.name = tempProperty.name.replaceAll(" ", "");
                tempProperty.value = tempProperty.value.trim();
            },
            _reset: () => {
                tempProperty.name = '';
                tempProperty.value = '';
                tempProperty.reading = 'name';
            }
        }

        this._read((char) => {
            const { loop } = this;

            const endRead = char === ";" && !loop.string.opened && tempProperty.reading === "value";

            if(endRead) {
                tempProperty._parse();

                const { name, value } = tempProperty;

                properties[name] = value;

                tempProperty._reset();
                return;
            }

            const startReadValue = char === ":" && !loop.string.opened && tempProperty.reading === "name"

            if(startReadValue) {
                tempProperty.reading = 'value';
                return;
            }

            const readValue = tempProperty.reading === "value";

            if(readValue) {
                tempProperty.value += char;
                return;
            }

            const readName = tempProperty.reading === "name";

            if(readName) {
                tempProperty.name += char;
            }
        });
        
        return properties;
    }
}

/** @DeleteOnJsFormat */ module.exports = CssStylePropertiesReader;