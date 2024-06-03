/**
 * Object intended to manage the form data
 */
class CjsForm {
    /** @type {HTMLFormElement} */
    #element;
    
    constructor(element) {
        this.#element = element;
    }

    /**
     * Serializes data from form element
     * @returns {object}
     */
    serialize() {
        const selects = Array.from(this.#element.querySelectorAll("select"));
        const inputs = Array.from(this.#element.querySelectorAll("input"));
        const elements = selects.concat(inputs);
        const data = {};

        for(let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.getAttribute("name");
            const value = element.getAttribute("type") === "checkbox" ? element.checked : element.value;
            const key = name || i;
        
            data[key] = value;
        }

        return data;
    }
}