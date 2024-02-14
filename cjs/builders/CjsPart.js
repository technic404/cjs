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
     * Returns data that will be passed to html
     * @param {object} data
     * @returns {object} data with merged default data 
     */
    #getData(data) {
        const mergedData = {};

        /**
         * Recursive function to merge objects
         * @param {object} obj1 object that will be changed to merged object
         * @param {object} obj2 object that will be overwriting data to obj1
         */
        function mergeObjects(obj1, obj2, l = false) {
            for (const key in obj2) {
                if(!obj2.hasOwnProperty(key)) continue;

                const hasObjectInside = typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]

                if (hasObjectInside) {
                    mergeObjects(obj1[key], obj2[key]);
                } else {
                    const propertyHasNullableValue = obj1[key] === null || obj1[key] === undefined;

                    if(propertyHasNullableValue) {
                        obj1[key] = obj2[key];
                    }
                }
            }
        }

        mergeObjects(mergedData, data);
        mergeObjects(mergedData, this.defaultData, true);

        return mergedData;
    }

    /**
     * Creates the part type element
     * @param {function(object)} func function that will return part html. The object argument is data provided to CjsPart using setData, toElement or toHtml.
     */
    constructor(func) {
        super("part", CJS_PART_PREFIX, func);

        this.defaultData = {};
        this.preSetData = {};
    }

    /**
     * Provides part element as HTMLElement
     * @param {object} data data to pass, to part
     * @returns {HTMLElement}
     */
    toElement(data = null) {
        return htmlToElement(this.toHtml(data));
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
    toHtml(data = null) {
        const isSet = data !== null;

        if(!isSet) return this._getHtml(this.#getData(this.preSetData));

        const notAnObject = typeof data !== "object";

        if(isSet && notAnObject) console.log(`${CJS_PRETTY_PREFIX_X}Provided non-object type param, expected object`);

        return this._getHtml(this.#getData(data));
    }

    /**
     * Sets data for part that could be recieved under text() method or action methods
     * @param {object} data information that should be transformed to part
     * @returns {CjsPart}
     */
    setData(data) {
        const isObject = (any) => { return any instanceof Object; }

        if(!isObject(data)) return console.log(`${CJS_PRETTY_PREFIX_X}Data passed into CjsPart.setData() have to be object type argument`)

        this.preSetData = data;

        const html = this._getHtml(this.#getData(data));

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

        return this;
    }

    /**
     * Sets default data, so if there is no values in original data, the missing values will be replaced with defaults
     * @param {object} data 
     */
    setDefaultData(data) {
        const isObject = (any) => { return any instanceof Object; }

        if(!isObject(data)) return console.log(`${CJS_PRETTY_PREFIX_X}Data passed into CjsPart.setDefaultData() have to be object type argument`);

        this.defaultData = data;
    }
}

// TODO add forward feature to findPart

/**
 * Finds part with selected direction of searching
 * @param {HTMLElement} part 
 * @param {"backward"} mode 
 */
function findPart(part, mode = "backward") {
    if(mode === "backward") {
        return findParentThatHasAttribute(part, CJS_PART_PREFIX, false);
    }
}