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
        const inputs = Array.from(this.#element.querySelectorAll("input"));
        const data = {};

        for(let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const name = input.getAttribute("name");
            const value = input.value;
            const key = name || i;
        
            data[key] = value;
        }

        return data;
    }
}