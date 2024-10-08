/** @type {CjsPage[]} */
const CjsPages = [];

/**
 * Organiser for declaring website sub pages
 */
class CjsPage {
    /**
     * @param {string} basename
     * @param {CjsComponent|CjsLayout[][]} elements 
     */
    constructor(basename, elements) {
        this.basename = basename;
        this.elements = elements;

        CjsPages.push(this);
    }
}