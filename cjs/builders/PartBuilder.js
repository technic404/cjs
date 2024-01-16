class Part {
    constructor(html, attribute) {
        this.html = html;
        this.tempHtml = html;
        this.attribute = attribute;
    }

    /**
     * @deprecated Method should be deleted, use setData instead
     * @param fieldsObject
     * @returns {Part}
     */
    applyTextFields(fieldsObject) {
        let element = htmlToElement(this.html);

        element = element.cloneNode(true);

        let outer = element.outerHTML;

        // Gets all the possible keys combination, so if there is an object { a: { b: 12 } }
        // The return will be array [ { key: 'a', value: { b: 12 } } ]
        // The return will be array [ { key: 'a.b', value: 12 } ]
        function getPossibleKeys(key, value) {
            const possibleKeys = [];

            if(value instanceof Object) {
                for(const [objKey, objValue] of Object.entries(value)) {
                    const parsedKey = `${key}.${objKey}`;

                    possibleKeys.push({ key: parsedKey, value: (objValue instanceof Object ? JSON.stringify(objValue) : objValue) });

                    getPossibleKeys(parsedKey, objValue).forEach(e => possibleKeys.push(e));
                }
            }

            return possibleKeys;
        }

        for(const [key, value] of Object.entries(fieldsObject)) {
            const flatKeys = { key: key, value: (value instanceof Object ? JSON.stringify(value) : value) };
            const keysCombinations = [flatKeys, ...getPossibleKeys(key, value)];
            keysCombinations.forEach(possibleKey => {
                if(!outer.includes(`${CJS_PART_TEXT_FIELD_PREFIX}-${possibleKey.key};`)) {
                    return;
                }

                // Safer way of replaceAll (supported by more devices)
                outer = safeReplaceAll(outer, `${CJS_PART_TEXT_FIELD_PREFIX}-${possibleKey.key};`, possibleKey.value.toString())
            });
        }

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

                if(selectorElements.length > 0) {
                    const endCut = notFoundField.slice(0, -3);

                    console.log(`${CJS_PRETTY_PREFIX_X}Object property ${Colors.Yellow}"${endCut}" ${Colors.None}located in ${Colors.Yellow}attribute ${Colors.None}was not found (${Colors.Yellow}${this.attribute}${Colors.None})`)
                }

                continue;
            }

            const safeReplaced = safeReplaceAll(notFoundField, "\n", "");
            const hasTagShape = safeReplaced.endsWith(">") && safeReplaced.includes("</");

            if(hasTagShape) {
                const closingTagBeginning = "</";
                const closingTagBeginningIndex = safeReplaced.indexOf(closingTagBeginning);
                const selector = `${safeReplaced.slice(closingTagBeginningIndex + closingTagBeginning.length, -1)}`
                const selectorElements = matchElement.querySelectorAll(`${selector}`);

                if(selectorElements.length > 0) {
                    const propertyName = selector.replace(`${CJS_PART_TEXT_FIELD_PREFIX}-`, "");

                    console.log(`${CJS_PRETTY_PREFIX_X}Object property ${Colors.Yellow}"${propertyName}" ${Colors.None}located in ${Colors.Yellow}element tag ${Colors.None}was not found (${Colors.Yellow}${this.attribute}${Colors.None})`)
                }

                continue;
            }

            console.log(`${CJS_PRETTY_PREFIX_X}Object property ${Colors.Yellow}"${safeReplaced}" ${Colors.None}located in ${Colors.Yellow}innerText ${Colors.None}was not found (${Colors.Yellow}${this.attribute}${Colors.None})`)
        }

        this.tempHtml = reloadAttributes(outer);

        return this;
    }

    /**
     * 
     * @deprecated
     * @param {Object} object
     * @return {Part}
     */
    setData(object) {
        this.applyTextFields(object); // have to be at first in here

        const element = htmlToElement((this.tempHtml));

        for(const child of [element, ...element.querySelectorAll("*")]) {
            const attributes = Array.from(child.attributes);
            const actionAttributes = attributes.filter(attribute => attribute.name.startsWith(CJS_ELEMENT_PREFIX));

            actionAttributes.forEach(attribute => {
                functionMappings.setData(attribute.name, object);
            });

            const observerAttributes = attributes.filter(attribute => attribute.name.startsWith(CJS_OBSERVER_PREFIX));

            observerAttributes.forEach(attribute => {
                const newAttribute = changesObserver.setData(attribute.name, object);

                changesObserver.replaceAttribute(child, attribute.name, newAttribute);
            })
        }

        this.tempHtml = reloadAttributes(element.outerHTML); // reloading attributes because of changes observer

        return this;
    }

    /**
     * Provides part element as HTMLElement
     * @param {object} data data to pass, to part
     * @returns {HTMLElement}
     */
    toElement(data = {}) {
        if(typeof data !== "object") console.log(`${CJS_PRETTY_PREFIX_X}Provided non-object type param, expected object`);

        const hasData = Object.keys(data).length > 0;

        if(hasData) this.setData(data);

        return htmlToElement(this.tempHtml);
    }

    findAllExistingParts() {
        return document.body.querySelectorAll(`[${this.attribute}='']`)
    }

    /**
     *
     * @param {"outerclick"|"click"|"contextmenu"|"dblclick"|"mousedown"|"mouseenter"|"mouseleave"|"mousemove"|"mouseout"|"mouseover"|"mouseup"|"keydown"|"keypress"|"keyup"|"blur"|"change"|"focus"|"focusin"|"focusout"|"input"|"invalid"|"reset"|"search"|"select"|"submit"|"drag"|"dragend"|"dragenter"|"dragleave"|"dragover"|"dragstart"|"drop"|"copy"|"cut"|"paste"|"animationend"|"animationiteration"|"animationstart"|"transitionend"|"abort"|"canplay"|"canplaythrough"|"durationchange"|"emptied"|"ended"|"loadeddata"|"loadedmetadata"|"loadstart"|"pause"|"play"|"playing"|"progress"|"ratechange"|"seeked"|"seeking"|"stalled"|"suspend"|"timeupdate"|"volumechange"|"waiting"|"beforeinput"|"fullscreenchange"|"fullscreenerror"|"resize"|"scroll"|"hashchange"|"load"|"unload"|"online"|"offline"|"popstate"|"storage"|"touchcancel"|"touchend"|"touchmove"|"touchstart"|"webkitfullscreenchange"|"webkitfullscreenerror"} event
     * @param {Boolean} isLocked
     */
    setEventLocked(event, isLocked) {
        const elements = this.findAllExistingParts();

        elements.forEach(element => {
            const attributes = functionMappings
                .getElementActionAttributes(element, event, true);

            attributes.forEach(attribute => {
                functionMappings.setEventAttributeLocked(attribute, isLocked);
            })
        })
    }

    /**
     * Provides part element as plain html
     * @param {object} data data to pass, to part
     * @returns {string}
     */
    toHtml(data = {}) {
        if(typeof data !== "object") console.log(`${CJS_PRETTY_PREFIX_X}Provided non-object type param, expected object`);

        const hasData = Object.keys(data).length > 0;

        if(hasData) this.setData(data);

        return (this.tempHtml);
    }

    /**
     *
     * @param {String} path
     * @param {Object} options
     * @param {boolean} options.prefixStyleRules
     * @param {boolean} options.encodeKeyframes
     * @param {boolean} options.enableMultiSelector it creates selector [attribute].class {} and [attribute] > * .class | if false it remain only [attribute].class {}
     */
    importStyle(path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
        addRootStyle(this.attribute, path, options).then();
    }
}

/**
 *
 * @param {String} html
 * @returns {Part}
 */
function createPart(html) {
    const template = document.createElement('template');

    template.innerHTML = html;

    if(template.content.children.length > 1) {
        console.log(`${CJS_PRETTY_PREFIX_X}Part have to contain one parent element at the top, wrap your code in container like div`)
    }

    const element = template.content.firstElementChild;
    const attribute = `${CJS_PART_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;

    element.setAttribute(attribute, '');

    return new Part(element.outerHTML, attribute);
}

/**
 *
 * @param {String} fieldName
 * @return {string}
 */
function text(fieldName) {
    return `${CJS_PART_TEXT_FIELD_PREFIX}-${fieldName};`;
}