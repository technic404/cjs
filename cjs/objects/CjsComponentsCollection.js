class CjsComponentsCollection {
    /** @param {function(HTMLElement)} func */
    #call = (func) => {
        this.components.forEach(c => func(c));
    }

    /** @param {HTMLElement} */
    _add(element) {
        this.components.push(element);
    }

    /**
     * 
     * @param {NodeListOf<HTMLElement>} components 
     */
    constructor(components) {
        this.components = Array.from(components);
    }

    /**
     * 
     * @param {string} className 
     * @returns {CjsComponentsCollection}
     */
    addClass(className) {
        this.#call((c) => c.classList.add(className));

        return this;
    }

    /**
     * 
     * @param {string} className 
     * @returns {CjsComponentsCollection}
     */
    removeClass(className) {
        this.#call((c) => c.classList.remove(className));

        return this;
    }
    
    /**
     * 
     * @param {string} className 
     * @returns {CjsComponentsCollection}
     */
    setClass(className) {
        this.#call((c) => c.className = className);

        return this;
    }

    /**
     * Adds class to provided element and removes the class from every other component
     * @param {HTMLElement} addTo 
     * @param {string} className 
     */
    addRemoveClass(addTo, className) {
        this.#call((c) => {
            if(c === addTo) {
                c.classList.add(className);
            } else {
                c.classList.remove(className);
            }
        })
    }
}