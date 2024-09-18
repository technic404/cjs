const Attr = require("./Attr");

class Tag {
    /**
     * 
     * @param {String} tagName 
     */
    constructor(tagName) {
        this.tagName = tagName;
        this.attributes = [];
        this.text = ``;
    }

    /**
     * Adds attributes to element
     * @param {Attr} tagAttributes 
     * @returns {IndexTag}
     */
    addAttributes(...tagAttributes) {
        this.attributes = this.attributes.concat(tagAttributes);

        return this;
    }

    /**
     * Sets inner text into element
     * @param {String} text 
     * @returns {IndexTag}
     */
    setText(text) {
        this.text = text;

        return this;
    }
}

module.exports = Tag;