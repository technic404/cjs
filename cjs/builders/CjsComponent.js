class CjsComponent extends CjsBuilderInterface {

    /**
     * 
     * @param {string} html 
     */
    constructor(html) {
        super("component", CJS_COMPONENT_PREFIX, html);
    }

    /**
     * Provides component element as HTMLElement
     * @param {boolean} ignoreReadyState 
     * @returns {HTMLElement}
     */
    toElement(ignoreReadyState = false) {
        const element = htmlToElement(this.html);

        element.setAttribute(this.attribute, '');

        const selector = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = selector !== null;
        const isDocumentLoaded = document.readyState === 'complete'

        if((isDocumentLoaded && !ignoreReadyState) || elementExists) return selector;

        return element;
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

}