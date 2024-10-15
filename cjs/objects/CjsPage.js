/** @type {CjsPage[]} */
const CjsPages = [];

/**
 * Organiser for declaring website sub pages
 */
class CjsPage extends CjsLayout {
    /**
     * @param {string} basename
     * @param {CjsComponent|CjsLayout[][]} elements 
     */
    constructor(basename, elements) {
        super(elements);

        this.basename = basename;

        CjsPages.push(this);
    }
}