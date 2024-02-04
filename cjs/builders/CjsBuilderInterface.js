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
     * @type {object}
     */
    _onLoadData = {};

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
     * Returns html containing attribute in parent with data transformed into its references
     * @param {object} data 
     * @returns {string} html
     */
    _getHtml = (data) => {
        const html = this.func(data);

        /**
         * Adds attributes to root element
         * 
         * For example if you have `<div class="wrapper"><p>text</p></div>`
         * 
         * The transformed code will be `<div attribute-1 attribute-2 class="wrapped"><p>text</p></div>`
         * @param {string} html
         * @param {string[]} attributes
         * @returns {string} code with added attributes
         */
        const addAttributes = (html, attributes) => {
            const element = createVirtualContainer(htmlToElement(html));
            const hasNoChildren = element.children.length === 0;
    
            if(hasNoChildren) return ``;
    
            const { firstElementChild } = element;

            attributes.forEach(attribute => {
                firstElementChild.setAttribute(attribute, "");
            });
    
            return firstElementChild.outerHTML;
        }

        if(this.type === "part" || true) {
            const onLoadAttribute = changesObserver.listen("add", () => this.#onLoadCallback(this._onLoadData));

            return addAttributes(html, [
                this.attribute, onLoadAttribute.trim()
            ]);
        }

        return addAttributes(html);
    }

    /**
     * 
     * @param {"component"|"part"} type 
     * @param {string} prefix 
     * @param {function(object)} func function that will return html
     */
    constructor(type, prefix, func) {
        this.type = type;
        this.prefix = prefix;
        this.func = func;

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
     * Sets load data for generic onLoad function
     * @param {object} onLoadData 
     * @returns {CjsPart|CjsComponent}
     */
    _setOnLoadData(onLoadData) {
        this._onLoadData = onLoadData;

        return this;
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