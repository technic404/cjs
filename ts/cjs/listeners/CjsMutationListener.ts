import { CjsEventAttributePrefix } from "../constants";
import { CjsEventsManager } from "../events/CjsEventsManager";
import { AnyHTMLElement, CjsEvent } from "../types";
import { _DOMElementsUtil } from "../utils/protected/_DOMElementsUtil";

export const CjsMutationListener = new class CjsMutationListener {
    #observer: MutationObserver;

    constructor() {
        this.#observer = new MutationObserver(this.callback);
    }

    #processCallback(eventId: string, element: Element) {
        if(!CjsEventsManager.hasCallback(eventId)) return;

        const eventCallback = CjsEventsManager.getCallback(eventId)!;
        const targetElement = eventCallback.applyToWindow ? window : element;

        targetElement.addEventListener(
            eventCallback.eventName, 
            (event) => eventCallback.callback({ event, source: element as AnyHTMLElement })
        );
    }

    #processOnAddElementCallback(eventId: string, element: Element) {
        if(!CjsEventsManager.hasOnAddElementCallback(eventId)) return;

        const eventCallback = CjsEventsManager.getOnAddElementCallback(eventId)!;

        eventCallback.callback({ event: null, source: element as AnyHTMLElement });
    }

    public processForms(): void {
        document.body.querySelectorAll("form").forEach(form => {
            form.onsubmit = e => e.preventDefault();
        });
    }

    public processElementEvents(virtualNode: Node): void {
        const attributes = _DOMElementsUtil.getAttributesStartingWith(
            virtualNode as Element,
            CjsEventAttributePrefix
        );

        if(attributes.length === 0) return;

        for(const attribute of attributes) {
            const elements = Array.from(document.body.querySelectorAll(`[${attribute}]`));
            const eventId = attribute.replace(CjsEventAttributePrefix, "");

            for(const element of elements) {
                element.removeAttribute(attribute);

                this.#processCallback(eventId, element);
                this.#processOnAddElementCallback(eventId, element);
            }
        }
    }

    callback = (mutationsList: MutationRecord[]) => {
        this.processForms();

        const childListMutations = mutationsList.filter(m => m.type === "childList");
        const modifiedNodes = childListMutations
            .filter(m => m.type === "childList")
            .flatMap(m => Array.from(m.addedNodes))
            .filter((node): node is HTMLElement => node.nodeType === 1)
            .flatMap(node => [
                node,
                ...Array.from(node.querySelectorAll("*"))
            ]);

        for (const virtualModifiedNode of modifiedNodes) {
            this.processElementEvents(virtualModifiedNode);
        }
    };

    public observe(): void {
        this.#observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}