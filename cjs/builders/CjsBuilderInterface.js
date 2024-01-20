const CjsTakenAttributes = {
    component: [], part: []
};



/**
 * @class
 * @classdesc Base class representing a generic builder interface.
 * @description
 * This class is designed to be extended by CjsPart or rather CjsComponent.
 * 
 * It provides common functionality that subclasses can build upon.
 */
class CjsBuilderInterface {
    /**
     * @type {string} attribute that indicated the element on the website
     */
    attribute = null;

    /**
     * Callback that is called when element is loaded into website
     */
    #onLoadCallback = function() {};

    /**
     * Generated unique attribute for certain element type
     */
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
     * @param {CjsStyleImportOptions} options
     */
    importStyle(path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
        addRootStyle(this.attribute, path, options).then();
    }

    /**
     * Converts element to HTMLElement type
     * @returns {HTMLElement}
     */
    toElement() {}

    /**
     * Converts element to plain html string
     * @returns {string}
     */
    toHtml() {}
}