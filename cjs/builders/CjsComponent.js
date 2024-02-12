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
     * @param {function(object)} func function that will return component html. The object argument is data provided by parent layout
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
        const element = htmlToElement(this._getHtml(this._onLoadData));
        const selector = document.body.querySelector(`[${this.attribute}=""]`);
        const elementExists = selector !== null;
        const isDocumentLoaded = document.readyState === 'complete'

        if((isDocumentLoaded && !ignoreReadyState) || elementExists) return selector;

        return element;
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
}