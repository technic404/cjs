const Attr = require("./Attr");

class Tag {
    /**
     * 
     * @param {string} tagName 
     */
    constructor(tagName) {
        this.tagName = tagName;
        this.attributes = [];
        this.text = ``;
    }

    /**
     * Adds attributes to element
     * @param {Attr} tagAttributes 
     * @returns {Tag}
     */
    addAttributes(...tagAttributes) {
        this.attributes = this.attributes.concat(tagAttributes);

        return this;
    }

    /**
     * Sets inner text into element
     * @param {string} text 
     * @returns {Tag}
     */
    setText(text) {
        this.text = text;

        return this;
    }
}

module.exports = Tag;