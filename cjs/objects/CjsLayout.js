class CjsLayout {
    /** @type {(object) => void} Callback that is called when element is loaded into website */
    #onLoadCallback = function(data) {};

    /** @type {{ default: object|null, active: object|null }} */
    #data = { default: null, active: null };

    /** @type {string} attribute identifier of layout */
    attribute;

    /**
     * @param {CjsComponent|CjsLayout[][]} elements 
     */
    constructor(elements) {
        this.elements = elements;

        this.attribute = Cjs.generateAttribute(CJS_LAYOUT_PREFIX, CjsTakenAttributes.layouts);
    }

    /**
     * Set function that will be executed when layout is loaded on website
     * @param {function} callback 
     */
    onLoad(callback) {
        this.#onLoadCallback = (data) => {
            CjsFrameworkEvents.onLoadLayout(this);
            callback(data);
        };
    }

    /**
     * Executes the onLoad function and sub components and layouts onLoad's
     * @param {object} data information passed to onLoad function
     */
    _executeOnLoad(data) {
        flattenInfinite(this.elements).forEach(element => { 
            const isLayout = element instanceof CjsLayout;

            if(isLayout) {
                element._executeOnLoad();
                return;
            }

            const isComponent = element instanceof CjsComponent;

            if(isComponent) {
                // element._executeOnLoad(this.data);
                element._setOnLoadData(this.data);
                return;
            }
        });

        this.#onLoadCallback(data);
    }

    /**
     * Finds component in layout
     * @param {CjsComponent} component
     * @returns {CjsComponent|null}
     */
    select(component) {
        const filtered = flattenInfinite(this.elements).filter(e => e.attribute === component.attribute);
        const componentNotExists = filtered.length === 0;

        if(componentNotExists) {
            console.log(`${CJS_PRETTY_PREFIX_X}Component not found when trying to use select(), make sure that provided component exists in layout`);
        
            return null;
        }

        return filtered[0];
    }

    /**
     * Provides data defined globally in layout
     * @returns {object} 
     */
    get data() {
        return this.#data.active;
    }

    /**
     * Resets layout data to state where first has been set
     * @returns {CjsLayout}
     */
    resetToDefaultData() {
        const isDefaultDataAlreadySet = this.#data.default !== null;

        if(!isDefaultDataAlreadySet) {
            console.log(`${CJS_PRETTY_PREFIX_X}Cannot reset layout data to default, because default data is not set`);

            return this;
        }

        this.#data.active = Object.assign({}, this.#data.default);

        return this;
    }

    /**
     * Sets global layout data
     * @param {object} data 
     * @returns {CjsLayout}
     */
    setData(data) {
        const isDefaultDataAlreadySet = this.#data.default !== null;

        if(isDefaultDataAlreadySet) {
            /**
             * 
             * @param {object} existing existing default layout data
             * @param {object} provided values provided by user to overwrite layout data
             * @returns {object} merged data with overwritten data
             */
            const overwriteNotSetValues = (existing, provided) => {
                // Deep clone the default configuration to avoid modifying it directly
                // TODO change that in the future, if passed for example custom class inside data
                // const merged = JSON.parse(JSON.stringify(existing));

                /**
                 * Created very deep copy for provided object
                 * @param {object} obj input
                 * @returns {object} copied object
                 */
                const deepObjectCopy = (obj) => {
                    const isPrimitive = obj === null || typeof obj !== 'object'; // like int, string, etc.

                    if(isPrimitive) return obj;

                    const isCustomClass = obj.constructor && obj.constructor !== Object
                    
                    if(isCustomClass) return new obj.constructor();

                    const isArray = Array.isArray(obj)
                    
                    if(isArray) {
                        const newArray = [];
                        
                        for (let i = 0; i < obj.length; i++) { newArray[i] = deepObjectCopy(obj[i]); }

                        return newArray;
                    }
                    
                    // If obj is a plain object, create a new object and deep copy each property
                    const newObj = {};

                    for (const key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;

                        newObj[key] = deepObjectCopy(obj[key]);
                    }

                    return newObj;
                }

                const merged = deepObjectCopy(existing);

                /**
                 * Recursive function that merged two objects
                 * @param {object} obj1 
                 * @param {object} obj2 
                 */
                const walk = (obj1, obj2) => {
                    for (const key in obj2) {
                        if(!obj2.hasOwnProperty(key)) continue;
        
                        if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
                            // If both are objects, merge them recursively
                            walk(obj1[key], obj2[key]);
                        } else {
                            // Otherwise, overwrite the value from user settings
                            obj1[key] = obj2[key];
                        }
                    }
                }
            
                walk(merged, provided);
            
                return merged;
            }

            this.#data.active = overwriteNotSetValues(this.#data.default, data)
        
            return this;
        }

        this.#data.default = Object.assign({}, data);
        this.#data.active = Object.assign({}, this.#data.default)

        return this;
    }

    /**
     * Replaces the website content with layout elements
     */
    replacePage() {
        const container = document.getElementById(CJS_ROOT_CONTAINER_PREFIX);

        container.innerHTML = ``;
        container.appendChild(this.toElement());

        this._executeOnLoad(this.#data.active);
    }

    /**
     * Finds layout in the DOM by query selector
     * @returns {HTMLElement}
     */
    getElement() {
        return document.body.querySelector(`[${this.attribute}]`);
    }

    /**
     * Checks if element exists in DOM
     * @returns {boolean}
     */
    exists() {
        return document.body.querySelector(`[${this.attribute}]`) !== null;
    }

    /**
     * Creates the HTMLElement from other layouts and components inside layout
     * @returns {HTMLElement} layout element
     */
    toElement() {
        const container = document.createElement("div");

        container.setAttribute(this.attribute, "");

        /**
         * 
         * @param {CjsComponent|CjsLayout[][]} elements 
         * @param {object} parentLayoutData
         * @returns {HTMLElement}
         */
        const walk = (elements, parentLayoutData) => {
            const componentInArray = elements instanceof Array;

            if(!componentInArray) {
                console.log(`${CJS_PRETTY_PREFIX_X}Layout have wrong pattern, component should be in array`);

                return document.createElement(`cjslayouterror`);
            }

            const noComponents = elements.length === 0;

            if(noComponents) {
                console.log(`${CJS_PRETTY_PREFIX_X}Layout have an empty component space`);

                return document.createElement(`cjslayouterror`);
            }

            const layoutElement = elements[0];
            const isLayout = layoutElement instanceof CjsLayout

            if(isLayout) return layoutElement.toElement();

            const isComponent = layoutElement instanceof CjsComponent;

            if(!isComponent) {
                console.log(`${CJS_PRETTY_PREFIX_X}The passed element inside layout is not CjsComponent and CjsLayout, expected CjsComponent or CjsLayout`);

                return document.createElement(`cjslayouterror`);
            }
            
            /**
             * @type {CjsComponent}
             */
            const component = layoutElement._setOnLoadData(parentLayoutData).toVirtualElement();
            const hasParentAndChild = elements.length === 2;

            if(hasParentAndChild) {
                /**
                 * @type {CjsComponent|CjsLayout[]}
                 */
                const componentChildren = elements[1]
                const isChildAnArray = componentChildren instanceof Array;

                if(!isChildAnArray) return console.log(`${CJS_PRETTY_PREFIX_X}Layout sub components at second argument have to be Array`);

                componentChildren.forEach(componentChild => {
                    component.insertAdjacentElement(`beforeend`, walk(componentChild, parentLayoutData))
                });
            }

            return component;
        }

        this.elements.forEach(elements => {
            container.insertAdjacentElement(`beforeend`, walk(elements, this.#data.active));
        });

        return container;
    }

    /**
     * Sets display to none
     */
    hide() {
        this.getElement().style.display = 'none';
    }

    /**
     * Removes display style property
     */
    show() {
        this.getElement().style.display = '';
    }
}