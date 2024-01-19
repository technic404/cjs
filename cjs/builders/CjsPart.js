class CjsPart extends CjsBuilderInterface {

    /**
     * Adds attribute to part root element
     * 
     * For example if you have `<div class="wrapper"><p>text</p></div>`
     * 
     * The transformed code will be `<div c_js-part class="wrapped"><p>text</p></div>`
     * @param {string} html
     * @returns {string} code with added part
     */
    #addAttributeToPart = (html) => {
        const element = createVirtualContainer(htmlToElement(html));
        const hasNoChildren = element.children.length === 0;

        if(hasNoChildren) return ``;

        const { firstElementChild } = element;

        firstElementChild.setAttribute(this.attribute, "");

        return firstElementChild.outerHTML;
    }

    constructor(html) {
        super("part", CJS_PART_PREFIX, html);

        this.html = this.#addAttributeToPart(this.html);
        this.tempHtml = this.html;
    }

    /**
     * Provides part element as HTMLElement
     * @param {object} data data to pass, to part
     * @returns {HTMLElement}
     */
    toElement(data = {}) {
        const notAnObject = typeof data !== "object";

        if(notAnObject) console.log(`${CJS_PRETTY_PREFIX_X}Provided non-object type param, expected object`);

        const hasData = Object.keys(data).length > 0;

        if(hasData) this.setData(data)

        return htmlToElement(this.tempHtml);
    }

    /**
     * Finds all parts with that type
     * @returns {HTMLElement[]}
     */
    findAllExistingParts() {
        return document.body.querySelectorAll(`[${this.attribute}='']`)
    }

    /**
     * Changes event locked state, if locked the event is not called
     * @param {"outerclick"|"click"|"contextmenu"|"dblclick"|"mousedown"|"mouseenter"|"mouseleave"|"mousemove"|"mouseout"|"mouseover"|"mouseup"|"keydown"|"keypress"|"keyup"|"blur"|"change"|"focus"|"focusin"|"focusout"|"input"|"invalid"|"reset"|"search"|"select"|"submit"|"drag"|"dragend"|"dragenter"|"dragleave"|"dragover"|"dragstart"|"drop"|"copy"|"cut"|"paste"|"animationend"|"animationiteration"|"animationstart"|"transitionend"|"abort"|"canplay"|"canplaythrough"|"durationchange"|"emptied"|"ended"|"loadeddata"|"loadedmetadata"|"loadstart"|"pause"|"play"|"playing"|"progress"|"ratechange"|"seeked"|"seeking"|"stalled"|"suspend"|"timeupdate"|"volumechange"|"waiting"|"beforeinput"|"fullscreenchange"|"fullscreenerror"|"resize"|"scroll"|"hashchange"|"load"|"unload"|"online"|"offline"|"popstate"|"storage"|"touchcancel"|"touchend"|"touchmove"|"touchstart"|"webkitfullscreenchange"|"webkitfullscreenerror"} event
     * @param {boolean} isLocked
     */
    setEventLocked(event, isLocked) {
        const elements = this.findAllExistingParts();

        for(const element of elements) {
            const attributes = functionMappings.getElementActionAttributes(element, event, true);

            attributes.forEach(attribute => {
                functionMappings.setEventAttributeLocked(attribute, isLocked);
            });
        }
    }

    /**
     * Provides part element as plain html
     * @param {object} data data to pass, to part
     * @returns {string}
     */
    toHtml(data = {}) {
        const notAnObject = typeof data !== "object";

        if(notAnObject) console.log(`${CJS_PRETTY_PREFIX_X}Provided non-object type param, expected object`);

        const hasData = Object.keys(data).length > 0;

        if(hasData) this.setData(data);

        return this.tempHtml;
    }

    setData(data) {
        const isObject = (any) => { return any instanceof Object; }
        const element = htmlToElement(this.html).cloneNode(true);

        let outer = element.outerHTML;

        /**
         * Gets all the possible keys combination, so if there is an object `{ a: { b: 12 } }`
         * 
         * The return will be array `[ { key: 'a', value: { b: 12 } } ]`
         * 
         * The return will be array `[ { key: 'a.b', value: 12 } ]`
         * @param {string} key 
         * @param {any} value 
         * @returns {{key: string, value: object|any}[]}
         */
        const getPossibleKeys = (key, value) => {
            const keys = [];

            if(!isObject(value)) return keys;

            for(const [objKey, objValue] of Object.entries(value)) {
                const parsedKey = `${key}.${objKey}`;

                keys.push({ key: parsedKey, value: (isObject(objValue) ? JSON.stringify(objValue) : objValue) });

                getPossibleKeys(parsedKey, objValue).forEach(e => keys.push(e));
            }

            return keys;
        }

        const replaceTextFieldsWithData = () => {
            for(const [key, value] of Object.entries(data)) {
                const flatKeys = { key: key, value: (isObject(value) ? JSON.stringify(value) : value) };
                const keysCombinations = [flatKeys, ...getPossibleKeys(key, value)];
    
                keysCombinations.forEach(possibleKey => {
                    const partTextFieldName = `${CJS_PART_TEXT_FIELD_PREFIX}-${possibleKey.key};`
                    const hasPartTextField = outer.includes(partTextFieldName);
    
                    if(!hasPartTextField) return;
    
                    // Safer way of replaceAll (supported by more devices)
                    outer = safeReplaceAll(outer, partTextFieldName, possibleKey.value.toString());
                });
            }
        }

        const checkForNotFilledTextFields = () => {
            const regex = new RegExp(`${CJS_PART_TEXT_FIELD_PREFIX}-([^ ;]+)`, 'g');
            let match;
    
            while ((match = regex.exec(outer)) !== null) {
                const partTextFieldText = match[0];
                const notFoundField = match[1];
                const matchElement = createVirtualContainer(htmlToElement(match.input));
                const endsWith = partTextFieldText.endsWith(`=""`);
    
                if(endsWith) {
                    const selector = `[${partTextFieldText}]`;
                    const selectorElements = matchElement.querySelectorAll(selector);
                    const hasSelectorElements = selectorElements.length > 0;
    
                    if(!hasSelectorElements) continue;

                    const endCut = notFoundField.slice(0, -3);
    
                    console.log(`${CJS_PRETTY_PREFIX_X}Object property ${Colors.Yellow}"${endCut}" ${Colors.None}located in ${Colors.Yellow}attribute ${Colors.None}was not found (${Colors.Yellow}${this.attribute}${Colors.None})`)
                }
    
                const safeReplaced = safeReplaceAll(notFoundField, "\n", "");
                const hasTagShape = safeReplaced.endsWith(">") && safeReplaced.includes("</");
    
                if(hasTagShape) {
                    const closingTagBeginning = "</";
                    const closingTagBeginningIndex = safeReplaced.indexOf(closingTagBeginning);
                    const selector = `${safeReplaced.slice(closingTagBeginningIndex + closingTagBeginning.length, -1)}`
                    const selectorElements = matchElement.querySelectorAll(`${selector}`);
                    const hasSelectorElements = selectorElements.length > 0;
    
                    if(!hasSelectorElements) continue;

                    const propertyName = selector.replace(`${CJS_PART_TEXT_FIELD_PREFIX}-`, "");
    
                    console.log(`${CJS_PRETTY_PREFIX_X}Object property ${Colors.Yellow}"${propertyName}" ${Colors.None}located in ${Colors.Yellow}element tag ${Colors.None}was not found (${Colors.Yellow}${this.attribute}${Colors.None})`)
                }
    
                console.log(`${CJS_PRETTY_PREFIX_X}Object property ${Colors.Yellow}"${safeReplaced}" ${Colors.None}located in ${Colors.Yellow}innerText ${Colors.None}was not found (${Colors.Yellow}${this.attribute}${Colors.None})`)
            }
        }

        const applyDataToActionMethods = () => {
            const element = htmlToElement((this.tempHtml));

            for(const child of [element, ...element.querySelectorAll("*")]) {
                const attributes = Array.from(child.attributes);
                const actionAttributes = attributes.filter(attribute => attribute.name.startsWith(CJS_ELEMENT_PREFIX));

                actionAttributes.forEach(attribute => {
                    functionMappings.setData(attribute.name, data);
                });

                const observerAttributes = attributes.filter(attribute => attribute.name.startsWith(CJS_OBSERVER_PREFIX));

                observerAttributes.forEach(attribute => {
                    const newAttribute = changesObserver.setData(attribute.name, data);

                    changesObserver.replaceAttribute(child, attribute.name, newAttribute);
                })
            }
        }

        replaceTextFieldsWithData();
        checkForNotFilledTextFields();

        this.tempHtml = reloadAttributes(outer);

        applyDataToActionMethods();

        this.tempHtml = reloadAttributes(this.tempHtml); // reloading attributes because of changes observer

        return this;
    }
}

/**
 *
 * @param {string} fieldName
 * @return {string}
 */
function text(fieldName) {
    return `${CJS_PART_TEXT_FIELD_PREFIX}-${fieldName};`;
}