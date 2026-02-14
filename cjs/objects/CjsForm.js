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
     * @param {{ checkboxesReadType?: "array"|"single", includeNoNames?: boolean }} options
     * @returns {object}
     */
    serialize(options = {}) {
        const selects = Array.from(this.#element.querySelectorAll("select"));
        const inputs = Array.from(this.#element.querySelectorAll("input"));
        const textareas = Array.from(this.#element.querySelectorAll("textarea"));
        const elements = selects.concat(inputs).concat(textareas);
        const data = {};

        for(let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.getAttribute("name");

            if(!name && !options.includeNoNames) continue;

            const type = element.getAttribute("type");
            const value = type in this.#valueProcessRules 
                ? this.#valueProcessRules[type](element) 
                : this.#valueProcessRules['*'](element);

            const key = name || i;

            data[key] = value;
        }

        if(options.checkboxesReadType && options.checkboxesReadType === "array") {
            const checkboxes = elements.filter(e => e.getAttribute("type") === "checkbox");

            for(const checkbox of checkboxes) {
                if(!checkbox.hasAttribute("name")) {
                    console.log(`${CJS_PRETTY_PREFIX_X}Checkbox doesn't have a name attribute, but it's required when options.checkboxesReadType === array`, checkbox);
                    continue;
                }

                const name = checkbox.getAttribute("name");

                if(!name) continue;

                if(!(name in data) || !Array.isArray(data[name])) data[name] = [];

                if(!checkbox.checked) continue;

                data[name].push(checkbox.value);
            }
        }

        return data;
    }
}