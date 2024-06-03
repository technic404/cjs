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
            const input = elements[i];
            const name = input.getAttribute("name");
            const value = input.getAttribute("type") === "checkbox" ? input.checked : input.value;
            const key = name || i;
        
            data[key] = value;
        }

        return data;
    }
}