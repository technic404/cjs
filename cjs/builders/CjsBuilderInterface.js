const CjsTakenAttributes = {
    component: [], part: []
};

/**
 * @typedef {Object} StyleImportOptions
 * @property {boolean} prefixStyleRules if prefix selectors by element attribute
 * @property {boolean} encodeKeyframes change names of the keyFrames so when you have two files with keyframe "click" there will be no conflict
 * @property {boolean} enableMultiSelector it creates selector [attribute].class {} and [attribute] > * .class | if false it remain only [attribute].class {}
 * 
 */

class CjsBuilderInterface {
    attribute = null;

    #onLoadCallback = function() {};

    #generateAttribute() {
        const takenAttributes = CjsTakenAttributes[this.type];

        /**
         * Determinates if do next iteration for searching non duplicated attribute
         * @returns {boolean} 
         */
        const next = () => {
            const doesNotHaveAttribute = this.attribute === null;
            const attributeIsTaken = takenAttributes.includes(this.attribute);

            return doesNotHaveAttribute || attributeIsTaken;
        }

        while (next()) {
            this.attribute = `${this.prefix}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }
    }

    /**
     * 
     * @param {"component"|"part"} type 
     * @param {string} prefix 
     * @param {string} html 
     */
    constructor(type, prefix, html) {
        this.type = type;
        this.prefix = prefix;
        this.html = html;

        this.#generateAttribute();
    }

    /**
     * Set function that will be executed when element is loaded on website
     * @param {function} callback 
     */
    onLoad(callback) {
        this.#onLoadCallback = callback;
    }

    /**
     * Executes the onLoad function
     * @param {object} data information passed to onLoad function
     */
    _executeOnLoad(data) {
        this.#onLoadCallback(data);
    }

    /**
     * Imports style to element from specified file
     * @param {string} path path of the specific style file (.css)
     * @param {StyleImportOptions} options
     */
    importStyle(path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
        addRootStyle(this.attribute, path, options).then();
    }

    toElement() {}

    toHtml() {}
}