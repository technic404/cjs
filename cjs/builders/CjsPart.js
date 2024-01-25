/**
 * @class
 * @classdesc Class for creating a Part used for creating small elements in website
 * @extends CjsBuilderInterface
 * @description
 * You can use that element to create repetitive elements on website like list elements.
 * 
 * That element is meant to be used as being duplicated.
 * 
 * If you want to use element single time, go for CjsComponent
 */
class CjsPart extends CjsBuilderInterface {

    /**
     * Returns html containing part attribute with data transformed into its references
     * @param {object} data 
     * @returns {string} html
     */
    #getHtml = (data) => {
        const html = this.func(data);

        /**
         * Adds attribute to part root element
         * 
         * For example if you have `<div class="wrapper"><p>text</p></div>`
         * 
         * The transformed code will be `<div c_js-part class="wrapped"><p>text</p></div>`
         * @param {string} html
         * @returns {string} code with added part
         */
        const addAttribute = (html) => {
            const element = createVirtualContainer(htmlToElement(html));
            const hasNoChildren = element.children.length === 0;
    
            if(hasNoChildren) return ``;
    
            const { firstElementChild } = element;
    
            firstElementChild.setAttribute(this.attribute, "");
    
            return firstElementChild.outerHTML;
        }

        return addAttribute(html);
    }

    /**
     * Creates the part type element
     * @param {function(object)} func function that will return part html
     */
    constructor(func) {
        super("part", CJS_PART_PREFIX);

        this.func = func;
    }

    /**
     * Provides part element as HTMLElement
     * @param {object} data data to pass, to part
     * @returns {HTMLElement}
     */
    toElement(data = {}) {
        const notAnObject = typeof data !== "object";

        if(notAnObject) console.log(`${CJS_PRETTY_PREFIX_X}Provided non-object type param, expected object`);

        return htmlToElement(this.#getHtml(data));
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

        return this.#getHtml(data);
    }

    /**
     * Sets data for part that could be recieved under text() method or action methods
     * @param {object} data information that should be transformed to part
     * @returns {CjsPart}
     */
    setData(data) {
        const isObject = (any) => { return any instanceof Object; }

        if(!isObject(data)) return console.log(`${CJS_PRETTY_PREFIX_X}Data passed into CjsPart.setData() have to be object type argument`)

        const html = this.#getHtml(data);

        const applyDataToActionMethods = () => {
            const element = htmlToElement(html);

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

        applyDataToActionMethods();
    }
}