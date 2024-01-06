const components = new Map(); // <attribute, component>

/**
 *
 * @param {String} html
 * @returns {Component}
 */
function createComponent(html) {
    return new Component(html);
}

class Component {
    constructor(html) {
        this.html = html;
        this.function = function () {}

        let attribute = null;

        while (components.has(attribute) || attribute === null) {
            attribute = `${CJS_COMPONENT_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        this.attribute = attribute;
    }

    toElement(ignoreReadyState = false) {
        const element = htmlToElement(this.html);

        element.setAttribute(this.attribute, '');

        const elementSelector = document.body.querySelector(`[${this.attribute}=""]`);

        if((document.readyState === 'complete' && !ignoreReadyState) || elementSelector !== null) {
            return elementSelector
        }

        return element;
    }

    insert(html) {
        const element = this.toElement();

        element.innerHTML = html;

        //functionMappings.applyBodyMappings();
    }

    /**
     *
     * @param {LayoutLoader} layoutLoader
     */
    loadLayout(layoutLoader) {
        const element = this.toElement();

        element.innerHTML = ``;
        element.insertAdjacentElement(`beforeend`, layoutLoader.getLayout().getLayoutElement());

        layoutLoader.loadLayoutMappings();
    }

    getAttribute() {
        return this.attribute;
    }

    /**
     *
     * @param {Function} f
     */
    onLoad(f) {
        this.function = f;
    }

    /**
     *
     * @param {String} path
     * @param {Object} options
     * @param {Boolean} options.prefixStyleRules
     * @param {Boolean} options.encodeKeyframes
     * @param {Boolean} options.enableMultiSelector it creates selector [attribute].class {} and [attribute] > * .class | if false it remain only [attribute].class {}
     */
    importStyle(path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
        addRootStyle(this.attribute, path, options).then();
    }
}