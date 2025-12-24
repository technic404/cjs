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
            const value =
                element.getAttribute("type") === "checkbox"
                    ? element.checked
                    : element.getAttribute("type") === "file"
                        ? element.files
                        : element.value;
            const key = name || i;
        
            data[key] = value;
        }

        return data;
    }
}