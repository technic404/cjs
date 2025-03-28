class CjsMutationEvent {
    /**
     * @param {HTMLElement} target
     * @param {Date} date
     */
    constructor(target, date) {
        this.target = target;
        this.date = date;
    }
}

/**
 * @class
 * @classdesc Class for detecting elements that are inserted into website DOM
 */
class CjsMutationListener {
    /** @type {(element: Node) => {}} */
    #onAddCallback = () => {};

    /**
     * @param {string} attribute 
     * @returns {HTMLElement[]}
     */
    #findRealElements = (attribute) => {
        return Array
            .from(document.querySelectorAll(`[${attribute}='']`))
            .flat()
    }

    /**
     * @param {MutationRecord[]} mutationsList 
     */
    #callback = (mutationsList) => {
        const childListMutations = mutationsList
        .filter((mutation) => mutation.type === 'childList');

        for(
            const fictionChild of childListMutations
                .map((mutation) => Array.from(mutation.addedNodes))
                .flat()
                .filter(node => node.nodeType === 1)
                .map((addedNode) => {
                    // Convert Node to HTMLElement
                    const element = document.createElement("div");
                    element.appendChild(addedNode.cloneNode(true));
            
                    return element;
                })
                .map((element) => Array.from(element.querySelectorAll("*")))
                .flat()
        ) {
            this.#onAddCallback(fictionChild);

            const elements = {
                element: getAttributeStartingWith(fictionChild, CJS_ELEMENT_PREFIX)
                    .map(attribute => {
                        return {
                            elements: this.#findRealElements(attribute),
                            attribute
                        }
                    })
                    .flat(),
                observer: getAttributeStartingWith(fictionChild, CJS_OBSERVER_PREFIX)
                    .map(attribute => {
                        return {
                            elements: this.#findRealElements(attribute),
                            attribute
                        }
                    })
                    .flat()
            }

            if(cjsRunnable.isStyleValid()) {
                const attributes = Array
                    .from(fictionChild.attributes)
                    .filter(attribute => CjsRunnableStyleWatcher.has(attribute.name));

                for(const attribute of attributes) {
                    // Find real path of the source style file
                    const runnableStyleWatcherData = CjsRunnableStyleWatcher.get(attribute.name);

                    // Find the short class name (compressed name) for style
                    const runnableDetailsData = CjsRunnableDetails.style.map.get(runnableStyleWatcherData.path);

                    if(!CjsRunnableDetails.style.map.has(runnableStyleWatcherData.path)){
                        console.log(`${CJS_PRETTY_PREFIX_X}Could not found the ${runnableStyleWatcherData.path} style file`)
                        return;
                    }

                    this.#findRealElements(attribute.name).forEach(child => {
                        child.setAttribute(runnableDetailsData.prefix, "");
                    });
                }
            }
            
            elements.element.forEach(data => {
                const { elements, attribute } = data;

                elements.forEach(element => {
                    // Allowing duplicates because of the child was added right now so it does not have any event yet
                    functionMappings.applyElementAttributeMappingFunction(element, attribute, true);
                });
            });

            elements.observer.forEach(data => {
                const { elements, attribute } = data;

                elements.forEach(element => {
                    this.execute("add", attribute, element);
                });
            });
        }

        for(
            const removedNode of childListMutations
                .map((mutation) => mutation.removedNodes)
                .flat()
        ) {
            const attributes = getAttributeStartingWith(removedNode, CJS_OBSERVER_PREFIX);

            attributes.forEach(attribute => {
                this.execute("remove", attribute, removedNode);
            });
        }
    }

    constructor() {
        this.map = new Map(); // attribute, { type: string, action: function, data: object }
        this.executedFunctions = new Map(); // attribute, { elements: HTMLElement[] }
        this.observer = new MutationObserver(this.#callback);
    }

    observe() {
        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * @param {(element: Node) => {}} callback 
     */
    _onAdd(callback) {
        this.#onAddCallback = callback;
    }

    /**
     * @param {"add"|"remove"} type
     * @param {function(CjsEvent)} f function to execute when changes observer detects the trigger
     * @returns {string} attribute
     */
    listen(type, f) {
        if(!["add", "remove"].includes(type)) {
            console.log(`${CJS_PRETTY_PREFIX_X}The 'type' param should be 'add' or 'remove'`)
            return null;
        }

        let attribute = null;

        while (this.map.has(attribute) || attribute === null) {
            attribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
        }

        this.map.set(attribute, { type: type, action: f, data: {} });

        return ` ${attribute} `;
    }

    /**
     * @param {string} attribute
     * @return {string|null} new attribute
     */
    cloneAttribute(attribute) {
        if(!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Map does not contain the attribute ${attribute}`);

            return null;
        }

        let newAttribute = null;

        while (this.map.has(newAttribute) || newAttribute === null) {
            newAttribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
        }

        const obj = Object.assign({}, this.map.get(attribute));

        this.map.set(newAttribute, obj);

        return newAttribute;
    }

    /**
     * @param {HTMLElement} element 
     * @param {string} oldAttribute 
     * @param {string} newAttribute 
     */
    replaceAttribute(element, oldAttribute, newAttribute) {
        element.removeAttribute(oldAttribute);
        element.setAttribute(newAttribute, "");
    }

    /**
     * Observer needs to reload attributes
     * @param {string} attribute
     * @param {object} data
     * @returns {string|Null}
     */
    setData(attribute, data) {
        if(!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided attribute does not exists`)
            return null;
        }

        const newAttribute = this.cloneAttribute(attribute);
        const obj = this.map.get(newAttribute);

        obj.data = data;

        return newAttribute;
    }

    /**
     * @param {"add"|"remove"} type
     */
    executeAll(type) {
        for(const [attribute, data] of CjsRunnableStyleWatcher.entries()) {
            const elements = document.body.querySelectorAll(`[${attribute}='']`);

            if(elements.length === 0) continue;

            elements.forEach(element => {
                const parsedPath = data.path;
                const attribute = CjsRunnableDetails.style.map.get(parsedPath);

                element.setAttribute(attribute.prefix, "");
            })
        }

        for(const [attribute, obj] of this.map.entries()) {
            if(obj.type !== type) continue;

            const elements = document.body.querySelectorAll(`[${attribute}='']`);

            if(elements.length === 0) continue;

            elements.forEach(element => {
                this.execute(type, attribute, element);
            });
        }
    }

    /**
     * @param {"add"|"remove"} type
     * @param {string} attribute
     * @param {HTMLElement|Node} element source element that has been changed
     */
    execute(type, attribute, element) {
        if(!this.map.has(attribute)) return;

        const isRegistered = this.executedFunctions.has(attribute);

        if(isRegistered) {
            const registeredElementMatches = this.executedFunctions.get(attribute).elements.includes(element);

            if(registeredElementMatches) return;
        }

        const obj = this.map.get(attribute);

        if(obj.type !== type) return;

        const cjsEvent = new CjsEvent(
            new CjsMutationEvent(element, new Date()),
            element,
        );

        obj.action(cjsEvent);

        if(!this.executedFunctions.has(attribute)) {
            this.executedFunctions.set(attribute, { elements: [] })
        }

        this.executedFunctions.get(attribute).elements.push(element);
    }
}