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
     * Sets the class name for all components
     * @param {string} token
     */
    set className(token) {
        this.#call((c) => c.className = token);
    }

    /**
     * Returns the value of first component className
     * @returns {string|null}
     */
    get className() {
        if(this.components.length === 0) return null;

        return this.components[0].className;
    }

    /**
     * Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object.
     */
    get classList() {
        return {
            /**
             * @param {...string} tokens 
             */
            add: (tokens) => this.#call((c) => c.classList.add(tokens)),
            /**
             * @param {...string} tokens 
             */
            remove: (...tokens) => this.#call((c) => c.classList.remove(tokens)),
            /**
             * @param {string} token 
             */
            contains: (token) => this.#call((c) => c.classList.contains(token)),
            /**
             * @param {string} token 
             * @param {boolean} force
             */
            toggle: (token, force = false) => this.#call((c) => c.classList.toggle(token, force)),
            /**
             * Adds class except the provided element
             * @param {string} token 
             * @param {HTMLElement} except 
             */
            addExcept: (token, except) => {
                this.#call((c) => {
                    if(c === except) return;

                    c.classList.add(token);
                });
            },
            /**
             * Removes class extept the provided element
             * @param {string} token 
             * @param {HTMLElement} except 
             */
            removeExcept: (token, except) => {
                this.#call((c) => {
                    if(c === except) return;

                    c.classList.remove(token);
                });
            },
            /**
             * Adds class to provided element, removes class from every other component
             * @param {string} token 
             * @param {HTMLElement} only 
             */
            addOnlyRemoveOthers: (token, only) => {
                this.#call((c) => {
                    c.classList[c === only ? "add" : "remove"](token);
                });
            },
            /**
             * Removes class from provided element, adds class to every other component
             * @param {string} token 
             * @param {HTMLElement} only 
             */
            removeOnlyAddOthers: (token, only) => {
                this.#call((c) => {
                    c.classList[c === only ? "remove" : "add"](token);
                });
            },
        }
    }
}