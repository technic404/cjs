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

    /**
     * Creates the component type element
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
     * Loads layout inside the selected component
     * @param {LayoutLoader} layoutLoader
     */
    loadLayout(layoutLoader) {
        const element = this.toElement();

        element.innerHTML = ``;
        element.insertAdjacentElement(`beforeend`, layoutLoader.getLayout().getLayoutElement());

        layoutLoader.loadLayoutMappings();
    }

}