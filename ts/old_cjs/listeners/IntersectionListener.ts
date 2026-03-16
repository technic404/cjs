import { CjsLazyClassPrefix, CjsLazyElementPrefix } from "../Constants";
import { getAttributeStartingWith } from "../utils/ElementUtil";

export class CjsIntersectionListener {
    public observer: IntersectionObserver;

    constructor() {
        this.observer = new IntersectionObserver(this.callback, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        });
    }

    private callback = (entries: IntersectionObserverEntry[]): void => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;

            const attribute = getAttributeStartingWith(entry.target, CjsLazyElementPrefix)[0];

            if (!attribute) continue;

            const domElement = document.body.querySelector<HTMLElement>(`[${attribute}]`);

            if (!domElement) continue;

            this.performLazy(domElement);
        }
    };

    public observe(element: Element): void {
        const attributes = getAttributeStartingWith(element, CjsLazyElementPrefix);

        if (!attributes.length) return;

        const attribute = attributes[0];
        const domElement = document.body.querySelector<HTMLElement>(`[${attribute}]`);

        if (!domElement) return;

        this.observer.observe(domElement);
    }

    /**
     * Observes all lazy elements in the document
     */
    public observeAll(): void {
        const elements = Array.from(
            document.querySelectorAll<HTMLElement>(`[class*='${CjsLazyClassPrefix}']`)
        );

        elements.forEach(element => this.observe(element));
    }

    /**
     * Performs lazy activation
     */
    public performLazy(element: HTMLElement): void {
        if (element.classList.length === 0) {
            this.observer.unobserve(element);
            return;
        }

        const lazyClass = Array.from(element.classList)
            .find(cls => cls.startsWith(CjsLazyClassPrefix));

        if (lazyClass) {
            const classNameToAdd = lazyClass.slice(CjsLazyClassPrefix.length);

            element.classList.remove(lazyClass);
            element.classList.add(classNameToAdd);
        }

        this.observer.unobserve(element);
    }
}