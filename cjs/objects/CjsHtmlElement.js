/**
 * Converts string to CjsHtmlElement
 */
class CjsHtmlElement {
    /** @type {HTMLElement} */
    #element;

    /**
     * 
     * @param {string} html 
     */
    constructor(html) {
        this.#element = htmlToElement(html);
    }

    /**
     * Returns pure html from created html element
     * @returns {string}
     */
    toString() {
        return this.#element.outerHTML;
    }

    /**
     * Returns pure html from created html element
     * @returns {string}
     */
    toHtml() {
        return this.#element.outerHTML;
    }

    /**
     * Returns HTMLElement from html
     * @returns {HTMLElement}
     */
    toElement() {
        return this.#element;
    }
}