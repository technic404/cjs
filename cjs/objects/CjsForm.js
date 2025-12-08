/**
 * @class
 * @classdesc Object intended to manage the form data
 */
class CjsForm {
    /** @type {HTMLFormElement} */
    #element;
    
    constructor(element) {
        this.#element = element;
    }

    #valueProcessRules = {
        "radio": (element) => element.checked ? element.value : null,
        "checkbox": (element) => element.checked,
        "file": (element) => element.files,
        "*": (element) => element.value,
    }

    /**
     * Serializes data from form element
     * @returns {object}
     */
    serialize() {
        const selects = Array.from(this.#element.querySelectorAll("select"));
        const inputs = Array.from(this.#element.querySelectorAll("input"));
        const textareas = Array.from(this.#element.querySelectorAll("textarea"));
        const elements = selects.concat(inputs).concat(textareas);
        const data = {};

        for(let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.getAttribute("name");
            const type = element.getAttribute("type");
            const value = type in this.#valueProcessRules
                ? this.#valueProcessRules[type](element)
                : this.#valueProcessRules["*"];
            const key = name || i;

            if(type === "radio" && (!element.checked || key in data)) continue;
        
            data[key] = value;
        }

        return data;
    }
}