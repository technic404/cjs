class FunctionMappings {
    constructor() {
        this.mappings = new Map(); // attribute, { type: "click", action: function }
        this.disabled = new Map(); // attribute, { events: ["click", "input", "outerclick"] }
        this.appliedFunctions = new Map(); // attribute, [ { element: HTMLElement, type: "click", mappingFunction: function } ]
    }

    /**
     * Adds new listener to website for provided event
     * @param {CjsCommonEvents} type
     * @param {function} mappingFunction
     * @param {{windowApplied: boolean, additionalName: string|null}} options
     * @param {object} data
     * @returns {string} attribute
     */
    add(type, mappingFunction, options = { windowApplied: false, additionalName: null }, data = {}) {
        let attribute = null;

        while (this.mappings.has(attribute) || attribute == null) {
            attribute = `${CJS_ELEMENT_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        this.mappings.set(attribute, { type: type, action: mappingFunction, options: options, data: data, isApplied: false, isLocked: false });

        return ` ${attribute} `; // space between
    }

    /**
     * Disables the provided event from being executed
     * @param {CjsCustomEvents} event
     * @returns {string}
     */
    disable(event) {
        let attribute = null;

        while (this.mappings.has(attribute) || attribute == null) {
            attribute = `${CJS_ELEMENT_DISABLED_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        this.disabled.set(attribute, { events: event })

        return ` ${attribute} `;
    }

    /**
     * Clones mapping without cloning the data and isApplied parameter
     * @param sourceAttribute
     * @returns {string|null}
     */
    cloneMapping(sourceAttribute) {
        if(!this.mappings.has(sourceAttribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Cannot clone mapping for ${Colors.Yellow}"${sourceAttribute}"${Colors.None}, because it does not exists`)
            return null;
        }

        const mapping = this.mappings.get(sourceAttribute);

        return this.add(mapping.type, mapping.action, mapping.options, mapping.data);
    }

    getElementActionAttributes(element, filterEventType = null, includeChildren = false) {
        const attributes = [];

        for(const child of [element, ...(includeChildren ? Array.from(element.children) : [])]) {
            let attributesStarting = getAttributeStartingWith(child, CJS_ELEMENT_PREFIX);

            if(filterEventType !== null) {
                attributesStarting.forEach(attributeStarting => {
                    if(!this.mappings.has(attributeStarting)) return;

                    const mapping = this.mappings.get(attributeStarting);

                    const { additionalName } = mapping.options;
                    const eventNameNotMatch = mapping.type !== filterEventType;
                    const additionalNameNotMatch = additionalName === null || filterEventType !== additionalName;

                    if(eventNameNotMatch && additionalNameNotMatch) return;

                    attributes.push(attributeStarting);
                })
            } else {
                attributesStarting.forEach(attributeStarting => {
                    attributes.push(attributeStarting);
                })
            }
        }

        return flattenInfinite(attributes);
    }

    setEventAttributeLocked(attribute, isLocked) {
        if(!this.mappings.has(attribute)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}${attribute}${Colors.None}, because it doesn't exists`);

        const mapping = this.mappings.get(attribute);

        mapping.isLocked = isLocked;
    }

    isEventAttributeLocked(attribute) {
        if(!this.mappings.has(attribute)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}"${attribute}"${Colors.None}, because it doesn't exists`);

        const mapping = this.mappings.get(attribute);

        return mapping.isLocked;
    }

    /**
     *
     * @param {string} attribute
     * @param {object} data
     */
    setData(attribute, data) {
        if(!this.mappings.has(attribute)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}"${attribute}"${Colors.None}, because it doesn't exists`);

        const mapping = this.mappings.get(attribute);

        mapping.data = data;
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {string} attribute
     * @param {boolean} allowDuplicates
     */
    applyElementAttributeMappingFunction(element, attribute, allowDuplicates = false) {
        if(!this.mappings.has(attribute)) return;

        const mapping = this.mappings.get(attribute);

        if(mapping.isApplied && !allowDuplicates) return;

        mapping.isApplied = true;

        if(!element) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Fatal error mapping for ${Colors.Yellow}"${attribute}"${Colors.None} failed, cannot find element matching that attribute`);
        }

        const targetElementEvent = (mapping.options.windowApplied ? window : element);

        const eventFunction = (event) => {
            const parent = findParentThatHasAttribute(
                mapping.options.windowApplied ? event.target : element,
                CJS_ELEMENT_DISABLED_PREFIX,
                true
            );

            if(parent !== null) {
                const startingAttributes = getAttributeStartingWith(parent, CJS_ELEMENT_DISABLED_PREFIX);

                for(const startingAttribute of startingAttributes) {
                    if(!this.disabled.has(startingAttribute)) continue;

                    const data = this.disabled.get(startingAttribute);

                    const hasDisabledCommonEvent = data.events.includes(mapping.type);
                    const hasDisabledAdditionalEvent = mapping.options.additionalName !== null && data.events.includes(mapping.options.additionalName)

                    if(hasDisabledCommonEvent || hasDisabledAdditionalEvent) {
                        return;
                    }
                }
            }

            if(this.isEventAttributeLocked(attribute)) return;

            mapping.action(event, element, mapping.data);
        }

        // Remove last applied event to prevent multi addEventListener to the element
        if(this.appliedFunctions.has(attribute)) { 
            const lastApplied = this.appliedFunctions.get(attribute);

            targetElementEvent.removeEventListener(lastApplied.type, lastApplied.mappingFunction);
        }

        this.appliedFunctions.set(attribute, { element: targetElementEvent, type: mapping.type, mappingFunction: eventFunction });

        targetElementEvent.addEventListener(mapping.type, eventFunction);
    }

    /**
     * Removes applied functions on element with specific attribute
     * @param {string} attribute 
     * @returns {boolean} if is success or not
     */
    removeElementAppliedFunctions(attribute) {
        if(!this.appliedFunctions.has(attribute)) {
            return false;
        }

        const data = this.appliedFunctions.get(attribute);
        const { element, type, mappingFunction } = data;

        element.removeEventListener(type, mappingFunction);

        return true;
    }



    /**
     *
     * @param {HTMLElement} element
     * @param {boolean} allowDuplicates
     */
    applyElementMappingFunction(element, allowDuplicates = false) {
        const attributes = getAttributeStartingWith(element, CJS_ELEMENT_PREFIX);

        for(const attribute of attributes) {
            this.applyElementAttributeMappingFunction(element, attribute, allowDuplicates);
        }
    }

    /**
     * Applies mappings to all elements in body without duplicates (theoretically)
     */
    applyBodyMappings() {
        for (const element of document.body.querySelectorAll("*")) {
            this.applyElementMappingFunction(element, false, 'body')
        }
    }
}

const functionMappings = new FunctionMappings();