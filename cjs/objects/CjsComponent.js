/**
 * @class
 * @classdesc Class for creating a Component used for styling in website
 * @description
 * You can use that element to set the website layout and flow.
 */
class CjsComponent {
    /** @type {string} attribute that indicated the element on the website */
    attribute = null;
    
    /** @type {object} */
    _onLoadData = {};

    /** Callback that is called when element is loaded into website */
    #onLoadCallback = function() {};

    /** @type {{ offset: number, maxHeight: number }} Auto fills height of the component to window height if set */
    #fillHeightData;

    /**
     * Returns data that will be passed to html
     * @param {object} data
     * @returns {object} data with merged default data 
     */
    _getData(data) {
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

        return CjsObject.copy(mergedData);
    }

    /**
     * Returns html containing attribute in parent with data transformed into its references
     * @param {object} data 
     * @param {object} layoutData
     * @returns {string} html
     */
    _getHtml = (data, layoutData = {}) => {
        // let elementPromiseResolver = () => {};
        //
        // const elementPromise = new Promise((resolve, rejest) => {
        //     elementPromiseResolver = resolve;
        // });
        const onLoadAttribute = mutationListener.listen("add", (cjsEvent) => {
            // elementPromiseResolver(cjsEvent.target);
            // console.log('resolved', cjsEvent.target);
            this._executeOnLoad(this._onLoadData)
        });
        // console.log('ola', onLoadAttribute, data)
        const html = this.func(data, () => document.querySelector(`[${onLoadAttribute}]`), layoutData);

        /**
         * Adds attributes to root element
         * 
         * For example if you have `<div class="wrapper"><p>text</p></div>`
         * 
         * The transformed code will be `<div attribute-1 attribute-2 class="wrapped"><p>text</p></div>`
         * @param {string} html
         * @param {string[]} attributes
         * @returns {string} code with added attributes
         */
        const addAttributes = (html, attributes) => {
            const element = createVirtualContainer(htmlToElement(html));
            const hasNoChildren = element.children.length === 0;
    
            if(hasNoChildren) return ``;
    
            const { firstElementChild } = element;

            attributes.forEach(attribute => {
                firstElementChild.setAttribute(attribute, "");
            });
    
            return firstElementChild.outerHTML;
        }

        /**
         * Adds identifiers to elements that use lazy scheme in their class names
         * @param {string} html 
         * @returns {string}
         */
        const addLazyIdentifiers = (html) => {
            const container = createVirtualContainer(htmlToElement(html));

            for(
                const element of Array
                    .from(container.querySelectorAll(`[class*='${CjsLazyClassPrefix}'`))
                    .filter(e => getAttributeStartingWith(e, CjsLazyElementPrefix).length == 0)
            ) {
                let id = null;

                while(id in CjsTakenAttributes.lazy || id === null) {
                    id = getRandomCharacters(CJS_ID_LENGTH);
                }

                CjsTakenAttributes.lazy.push(id);

                const attribute = `${CjsLazyElementPrefix}${id}`;

                element.setAttribute(attribute, "");
            }

            return container.innerHTML;
        }

        return addAttributes(addLazyIdentifiers(html), [
            this.attribute, onLoadAttribute.trim()
        ]);
    }

    /** @returns {CjsForm[]} */
    get forms() {
        const element = this.toElement();
        const forms = Array.from(element.querySelectorAll("form"));
        const componentIsForm = element.tagName === "FORM"

        if(componentIsForm) forms.push(element);

        return forms.map(form => new CjsForm(form));
    }

    /**
     * @returns {CjsComponentsCollection}
     */
    get components() {
        return new CjsComponentsCollection(document.body.querySelectorAll(`[${this.attribute}='']`));
    }

    /**
     * Creates the component type element
     * @param {(componentData: object, find: () => HTMLElement, layoutData: object) => string} func function that will return component html. The object argument is data provided by parent layout
     */
    constructor(func) {
        this.func = func;

        this.defaultData = {};
        this.preSetData = {};

        this.attribute = Cjs.generateAttribute(CJS_COMPONENT_PREFIX, CjsTakenAttributes.components);
    }

    /**
     * Parses HTMLElement to forms
     * @param {HTMLElement} element 
     * @returns {CjsForm[]}
     */
    toForms(element) {
        const forms = Array.from(element.querySelectorAll("form"));
        const componentIsForm = element.tagName === "FORM"

        if(componentIsForm) forms.push(element);

        return forms.map(form => new CjsForm(form));
    }

    /**
     * Clones an component and sets data with argument (used for Layouts)
     * @param {object} data
     * @returns {CjsComponent}
     */
    withData(data) {
        const clone = Object.create(Object.getPrototypeOf(this));
        Object.assign(clone, this);
        clone.attribute = Cjs.generateAttribute(CJS_COMPONENT_PREFIX, CjsTakenAttributes.components)
        return clone.setData(data);
    }

    /**
     * Determinates if component exists in DOM
     * @returns {boolean}
     */
    exists() {
        const selector = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = selector !== null;

        return elementExists;
    }

    /**
     * Auto fills height of the component to window height
     * @param {number} offset determinates the offsets
     */
    fillHeight(offset = 0, maxHeight = undefined) {
        this.#fillHeightData = {
            offset,
            maxHeight
        };
    }

    /**
     * Creates a component as an new instance of HTMLElement that doesn't exists in DOM
     * @returns {HTMLElement}
     */
    toVirtualElement() {
        return htmlToElement(this._getHtml(this._getData(this.preSetData), this._onLoadData));
    }

    /**
     * Provides component element as HTMLElement, could be a new instance if not exists in DOM, but also could return existing component in DOM
     * @param {boolean} ignoreReadyState 
     * @returns {HTMLElement}
     */
    toElement(ignoreReadyState = false) {
        const DOMElement = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = DOMElement !== null;

        if(elementExists) return DOMElement;

        const isDocumentLoaded = document.readyState === 'complete';

        if(isDocumentLoaded && !ignoreReadyState) return DOMElement;

        return this.toVirtualElement();
    }

    /**
     * Renders the html string from provided data
     * @param {object} data 
     * @returns {string}
     */
    render(data = {}) {
        return this._getHtml(this._getData(data), this._onLoadData);
    }

    /**
     * Visualises component as HTMLElement
     * @param {object} data 
     * @returns {HTMLElement}
     */
    visualise(data = {}) {
        return htmlToElement(this.render(data));
    }

    /**
    * Sets data for component and reload the old component occurrence
    * @param {object} data information that should be inserted to component
    * @returns {CjsComponent}
    */
    setData(data) {
        const isObject = (any) => { return any instanceof Object; }

        if(!isObject(data)) return console.log(`${CJS_PRETTY_PREFIX_X}Data passed into setData() have to be object type argument`)

        this.preSetData = data;

        const selector = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = selector !== null;

        if(elementExists) {
            selector.replaceWith(htmlToElement(this._getHtml(this._getData(data), this._onLoadData)))
        }

        return this;
    }

    /**
     * Loads layout inside the selected component
     * @param {CjsLayout} layouts
     */
    loadLayout(...layouts) {
        const element = this.toElement();

        element.innerHTML = ``;

        for(const layout of layouts) {
            element.insertAdjacentElement(`beforeend`, layout.toElement());

            // Timeout because of addEventListener overlaping
            setTimeout(() => {
                layout._executeOnLoad();

                CjsFrameworkEvents.onLoadLayout(layout);
            }, 2);
        }
    }


    /**
     * Redenders all components this type when search changed
     * @param {{ useSmartRender: boolean }} data 
     * @returns {CjsComponent}
     */
    rerenderOnSearch(data = { useSmartRender: false }) {
        Search.onChange(() => this.rerenderComponents(data));

        return this;
    }

    /**
     * Redenders all components this type
     * @param {object} data
     * @param {{ useSmartRender: boolean }} options
     * @returns {CjsComponent}
     */
    rerenderComponents(data = {}, options = { useSmartRender: false }) {
        const components = Array.from(document.body.querySelectorAll(`[${this.attribute}]`));
        const element = htmlToElement(this._getHtml(data, this._onLoadData));

        if(options.useSmartRender) {
            for(const component of components) {
                /**
                 * @param {HTMLElement} parent 
                 * @param {HTMLElement} newParent 
                 */
                const walk = (parent, newParent) => {
                    const attributesMap = (attributes) => {
                        const obj = {};
                        
                        Array.from(attributes).forEach(attribute => {
                            obj[attribute.name] = attribute.value;
                        });

                        return obj;
                    }

                    if(newParent === null) {
                        parent.remove();
                        return;
                    }

                    const children = Array.from(parent.children);
                    const newChildren = Array.from("children" in newParent ? newParent.children : []);

                    for(let i = 0; i < children.length; i++) {
                        const child = children[i];
                        const newChild = newChildren[i];

                        if(newChild === undefined) continue;

                        const sameInnerText = child.innerText === newChild.innerText;
                        const hasNoChildren = child.children.length === 0;

                        if(!sameInnerText && hasNoChildren) {
                            child.innerText = newChild.innerText;
                        }

                        const sameTags = child.tagName === newChild.tagName;

                        if(!sameTags) {
                            child.replaceWith(newChild);
                            continue;
                        }

                        const attributes = attributesMap(child.attributes);
                        const newAttributes = attributesMap(newChild.attributes);
                        const addedAttributeNames = [];

                        for(const [name, value] of Object.entries(attributes)) {
                            const hasUnusedAttribute = !(name in newAttributes);
                            const isCjsAttribute = name.startsWith(CJS_PREFIX);

                            if(hasUnusedAttribute) {
                                child.removeAttribute(name);

                                if(isCjsAttribute) {
                                    functionMappings.removeElementAppliedFunctions(name);
                                }

                                continue;
                            }

                            const newAttributeValue = newAttributes[name];

                            const isSameValue = value === newAttributeValue;

                            if(!isSameValue) {
                                child.setAttribute(name, newAttributeValue);
                                addedAttributeNames.push(name);
                                continue;
                            }
                        }

                        for(const [name, value] of Object.entries(newAttributes)) {
                            const wasAdded = addedAttributeNames.includes(name);

                            if(wasAdded) continue;

                            const isCjsAttribute = name.startsWith(CJS_PREFIX);

                            if(isCjsAttribute) {
                                functionMappings.applyElementAttributeMappingFunction(child, name, false);
                            }

                            child.setAttribute(name, value);
                        }
                    }

                    if(parent.nodeType === Node.ELEMENT_NODE && newParent.nodeType === Node.ELEMENT_NODE) {
                        if(parent.children.length > newParent.children.length) {
                            const diff = parent.children.length - newParent.children.length;
                            const childrenToRemove = Array.from(parent.children).slice(-1 * diff);
    
                            childrenToRemove.forEach(c => c.remove());
                        }
                    }

                    const childrenToAppend = newChildren.slice(children.length);

                    for(const child of childrenToAppend) {
                        parent.appendChild(child);
                    }
                }

                /**
                 * 
                 * @param {HTMLElement} root 
                 * @param {HTMLElement} newRoot 
                 */
                const traverse = (root, newRoot) => {
                    walk(root, newRoot);

                    let rootChildNode = root.firstChild;
                    let newRootChildNode = newRoot !== null ? newRoot.firstChild : null;
                    while(rootChildNode) {
                        if(rootChildNode.nodeType === Node.ELEMENT_NODE) {
                            traverse(rootChildNode, newRootChildNode);
                        }

                        if(newRootChildNode === null) return;

                        rootChildNode = rootChildNode.nextSibling;
                        newRootChildNode = newRootChildNode.nextSibling;
                    }
                }

                traverse(component, element);
            }
        } else {
            for(const component of components) {
                component.replaceWith(element);
            }
        }

        return this;
    }

    /**
     * Set function that will be executed when element is loaded on website
     * @param {() => void} callback 
     */
    onLoad(callback) {
        this.#onLoadCallback = callback;
    }

    /**
     * Sets load data for generic onLoad function
     * @param {object} onLoadData 
     * @returns {CjsPart|CjsComponent}
     */
    _setOnLoadData(onLoadData) {
        this._onLoadData = onLoadData;

        return this;
    }

    /**
     * Sets display to none
     */
    hide() {
        this.toElement().style.display = 'none';
    }

    /**
     * Removes display style property
     */
    show() {
        this.toElement().style.display = '';
    }

    /**
     * Executes the onLoad function
     * @param {object} data information passed to onLoad function
     */
    _executeOnLoad(data) {
        this.#onLoadCallback(data);
        
        if(this.#fillHeightData !== undefined) {
            const { maxHeight, offset } = this.#fillHeightData;
            const element = this.toElement();
            const resize = () => element.style.height = `${window.innerHeight > maxHeight ? maxHeight : window.innerHeight + offset}px`;

            resize();

            window.addEventListener('resize', resize);
        }
    }

    /**
     * Imports style to element from specified file
     * @param {string} path path of the specific style file (.css)
     * @param {CjsStyleImportOptions} options
     */
    importStyle(path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
        addRootStyle(this.attribute, path, options).then();
    }

    /**
     * Sets default data, so if there is no values in original data, the missing values will be replaced with defaults
     * @param {object} data 
     * @returns {CjsComponent}
     */
    setDefaultData(data) {
        const isObject = (any) => { return any instanceof Object; }

        if(!isObject(data)) return console.log(`${CJS_PRETTY_PREFIX_X}Data passed into setDefaultData() have to be object type argument`);

        this.defaultData = data;

        return this;
    }


    /**
     * Returns the first element that is a descendant of node that matches selectors (only for the first instance of the component).
     * @param {string|string[]} selectors
     * @returns {HTMLElement|null|HTMLElement[]}
     */
    querySelector(...selectors) {
        const _querySelector = (_selectors) => this.toElement().querySelector(_selectors);

        const mapped = selectors.map(selector => _querySelector(selector));

        if(mapped.length > 1) return mapped;

        return this.toElement().querySelector(selectors);
    }

    /**
     * Returns all element descendants of node that match selectors (for all instances of component).
     * @param {string} selectors 
     * @returns {HTMLElement[]|Element[]}
     */
    querySelectorAll(selectors) {
        return Array.from(this.toElement().querySelectorAll(selectors));
    }
}