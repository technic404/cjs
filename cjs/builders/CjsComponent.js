/**
 * @class
 * @classdesc Class for creating a Component used for styling in website
 * @extends CjsBuilderInterface
 * @description
 * You can use that element to set the website layout and flow.
 * 
 * It is recommended not to duplicate Components multiple times (CjsPart is for that).
 */
class CjsComponent extends CjsBuilderInterface {

    /** @type {CjsForm[]} */
    forms = [];

    /** @type {boolean} */
    #rerenderOnSearchEnabled = false;

    #update(element) {
        this.forms = Array.from(element.querySelectorAll("form")).map(form => new CjsForm(form));
    }

    /**
     * @returns {CjsComponentsCollection}
     */
    get components() {
        return new CjsComponentsCollection(document.body.querySelectorAll(`[${this.attribute}='']`));
    }

    /**
     * Creates the component type element
     * @param {function(object, object)} func function that will return component html. The object argument is data provided by parent layout
     */
    constructor(func) {
        super("component", CJS_COMPONENT_PREFIX, func);
    }

    /**
     * Provides component element as HTMLElement
     * @param {boolean} ignoreReadyState 
     * @returns {HTMLElement}
     */
    toElement(ignoreReadyState = false) {
        // const element = htmlToElement(this._getHtml(this._onLoadData));
        const element = htmlToElement(this._getHtml(this._getData(this.preSetData), this._onLoadData));
        const selector = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = selector !== null;
        const isDocumentLoaded = document.readyState === 'complete';

        if((isDocumentLoaded && !ignoreReadyState) || elementExists) {
            this.#update(selector);

            return selector;
        }

        this.#update(element);

        return element;
    }

    /**
     * Renders the html string from provided data
     * @param {object} data 
     * @returns {string}
     */
    render(data = {}) {
        const html = this._getHtml(data, this._onLoadData);

        this.#update(htmlToElement(html));

        return html;
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
    * @returns {CjsBuilderInterface}
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
     * @param {CjsLayout} layout
     */
    loadLayout(layout) {
        const element = this.toElement();

        element.innerHTML = ``;
        element.insertAdjacentElement(`beforeend`, layout.toElement());

        // timeout because of addEventListener overlaping
        setTimeout(() => { 
            layout._executeOnLoad();

            CjsFrameworkEvents.onLoadLayout(layout);
        }, 2);
    }


    rerenderOnSearch(data = { useSmartRender: false }) {
        Search.addListener(() => this.rerenderComponents(data));

        this.#rerenderOnSearchEnabled = true;

        return this;
    }

    /**
     * 
     * @param {{ useSmartRender: boolean }} data
     * @returns {CjsComponent}
     */
    rerenderComponents(data = { useSmartRender: false }) {
        const components = Array.from(document.body.querySelectorAll(`[${this.attribute}]`));
        const element = htmlToElement(this._getHtml({}, this._onLoadData));

        if(data.useSmartRender) {
            for(const component of components) {
                /**
                 * 
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

                this.#update(component);
            }
        } else {
            for(const component of components) {
                component.replaceWith(element);
            }

            this.#update(element);
        }

        return this;
    }
}