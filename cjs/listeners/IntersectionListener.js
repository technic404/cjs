/**
 * @class
 * @classdesc Class for detecting elements that appear in user view
 */
class CjsIntersectionListener {
    /**
     * @param {IntersectionObserverEntry[]} entries 
     */
    #callback = (entries) => {
        for(const entry of entries) {
            if(!entry.isIntersecting) continue;

            const attribute = getAttributeStartingWith(entry.target, CjsLazyElementPrefix)[0];
            const DOMElement = document.body.querySelector(`[${attribute}]`);

            this.performLazy(DOMElement);
        }
    }

    constructor() {
        this.observer = new IntersectionObserver(this.#callback, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        });
    }

    /**
     * @param {Node} element 
     */
    observe(element) {
        const attributes = getAttributeStartingWith(element, CjsLazyElementPrefix);
        const noLazyAttribute = attributes.length === 0;

        if(noLazyAttribute) return;

        const attribute = attributes[0];
        const DOMElement = document.body.querySelector(`[${attribute}]`);

        this.observer.observe(DOMElement);
    }

    /**
     * Observes all elements with attribute
     */
    observeAll() {
        const elements = Array.from(document.querySelectorAll(`[class*='${CjsLazyClassPrefix}']`));

        elements.forEach(element => {
            this.observe(element);
        });
    }

    /**
     * @param {HTMLElement} element 
     */
    performLazy(element) {
        if(element.classList.length === 0) return this.observer.unobserve(element);

        const lazyClass = Array.from(element.classList).find(cls => cls.startsWith(CjsLazyClassPrefix));

        if (lazyClass) {
            const classNameToAdd = lazyClass.slice(CjsLazyClassPrefix.length);
            
            element.classList.remove(lazyClass);
            element.classList.add(classNameToAdd);
        }

        this.observer.unobserve(element);
    }
}