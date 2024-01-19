class Layout {
    /**
     *
     * @param {Array<Array<Component>>} components
     * @param {Element} layoutElement
     */
    constructor(components, layoutElement) {
        this.components = components;
        this.layoutElement = layoutElement;
    }

    /**
     *
     * @param {Component} component
     * @returns {Element|null}
     */
    getComponentElement(component) {
        return this.layoutElement.querySelector(`[${component.getAttribute()}='']`);
    }

    /**
     *
     * @param {Component} component
     * @return {Component|null}
     */
    select(component) {
        if(this.getComponentElement(component)) return component;

        console.error(`Couldn't select component provided in select() selector`);
        return null;
    }

    getLayoutElement() {
        return this.layoutElement.cloneNode(true);
    }

    clone() {
        return new Layout(
            this.components,
            this.layoutElement.cloneNode(true),
        )
    }
}

/**
 *
 * @param {Array<Array<Component>>} components
 * @returns {Layout}
 */
function createLayout(components) {
    const layout = document.createElement("div");

    function x(component) {
        if(!(component instanceof Array)) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Layout have wrong pattern, component should be in array`)
        }

        if(component.length <= 0) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Layout have an empty component space`);
        }

        let result = null;

        if(component[0] instanceof LayoutLoader) {
            const layoutLoader = component[0];

            result = layoutLoader.getLayout().getLayoutElement();
        } else if(component[0].toElement(true) instanceof HTMLElement) {
            let main = component[0].toElement(true).cloneNode(true);

            if(component.length === 2) {
                if(!(component[1] instanceof Array)) {
                    return console.log(`${CJS_PRETTY_PREFIX_X}Layout sub components at second argument have to be Array`)
                }

                component[1].forEach(c => {
                    main.insertAdjacentElement(`beforeend`, x(c))
                })
            }

            result = main;
        }

        return result;
    }

    components.forEach(component => {
        layout.insertAdjacentElement(`beforeend`, x(component));
    });

    return new Layout(
        components,
        layout
    );
}

class LayoutLoader {
    /**
     *
     * @param {Layout|LayoutLoader} layout
     */
    constructor(layout) {
        this.layout = (layout instanceof LayoutLoader) ? layout.getLayout() : layout;
        this.firstData = {};
        this._data = {};
        this.function = function() {};
    }

    get data() { return this._data }

    /**
     *
     * @param {Object} data
     */
    set data(data) {
        if(!(data instanceof Object)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot pass non-object param type to data setter`);

        this._data = data;
    }

    /**
     * Should be executed once only in Layout instance file, do not store here big values
     * @param {Object} data
     */
    setDefaultData(data) {
        if(!(data instanceof Object)) return console.log(`${CJS_PRETTY_PREFIX_X}Cannot pass non-object param type to data setter`);

        this._data = Object.assign({}, data);
        this.firstData = (JSON.stringify(data));
    }

    resetToDefaultData() {
        this._data = Object.assign({}, JSON.parse(this.firstData));
    }

    clone() {
        return new LayoutLoader(
            this.layout.clone()
        )
    }

    /**
     *
     * @param {Component} component
     * @return {Component|null}
     */
    select(component) {
        const selected = this.layout.select(component);

        if(!selected) {
            console.log(`${CJS_PRETTY_PREFIX_X}Component not found when trying to use select(), make sure that provided component exists in layout`);
        }

        return selected;
    }

    /**
     *
     * @return {Layout}
     */
    getLayout() {
        return this.layout;
    }

    /**
     * Sets data and overrides only provided properties
     * @param {Object} object
     * @return {LayoutLoader}
     */
    setData(object) {
        for(const [key, value] of Object.entries(object)) {
            this._data[key] = value;
        }

        return this;
    }

    /**
     *
     * @param {Function} f
     */
    onLoad(f) {
        this.function = f;
    }

    loadLayoutMappings() {
        flattenInfinite(this.layout.components).forEach(component => { 
            const isLayout = component instanceof LayoutLoader;

            if(isLayout) {
                component.loadLayoutMappings();
                return;
            }

            const isComponent = component instanceof CjsComponent;

            if(isComponent) {
                component._executeOnLoad(this._data);
                return;
            }
        });

        this.function(this._data);

        return this;
    }
}

/**
 *
 * [
 *   [NavigationComponent],
 *   [
 *      TestComponent,
 *      [
 *          [NextComponent],
 *          [AnotherComponent],
 *          [KindComponent]
 *      ]
 *   ],
 *   [
 *      WelcomeComponent,
 *      [
 *          SectionComponent,
 *          [
 *              [TextComponent],
 *              [ButtonComponent]
 *          ]
 *      ]
 *   ]
 * ]
 */