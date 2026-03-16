import { CJS_DOM_ELEMENT_ID_ATTRIBUTE } from "./Constants";
import { CjsEvent } from "./objects/CjsEvent";
import { CjsCommonEvent } from "./types";


type VirtualDOMElementAction = {
    callback: (event: CjsEvent) => any,
    windowApplied: boolean,
    wasApplied: boolean
}

class CjsVirtualDOMElement {
    id: number;
    actions = new Map<CjsCommonEvent, VirtualDOMElementAction[]>();

    constructor(id: number) {
        this.id = id;
    }

    getDOMElement() {
        return document.body.querySelector(`[${CJS_DOM_ELEMENT_ID_ATTRIBUTE}="${this.id}"]`);
    }

    DOMElementExists() {
        return this.getDOMElement() !== null;
    }

    getHTMLAttribute() {
        return ` ${CJS_DOM_ELEMENT_ID_ATTRIBUTE}="${this.id}" `;
    }

    applyActions() {
        const DOMElement = this.getDOMElement();

        if(!this.DOMElementExists()) return false;

        for(const [commonEvent, actions] of this.actions.entries()) {
            for(const action of actions.filter(action => !action.wasApplied)) {
                const targetElement = action.windowApplied ? window : DOMElement!;

                targetElement.addEventListener(commonEvent, (event) => {
                    action.callback(new CjsEvent(
                        event,
                        DOMElement as HTMLElement
                    ))
                });
            }
        }
    }
}

export const CjsDOMElements = new class CjsDOMElements {
    
    idIterator = 0;
    elements = new Map<number, CjsVirtualDOMElement>();

    constructor() {

    }

    createNewVirtualElement() {
        const virtualElement = new CjsVirtualDOMElement(this.idIterator++);

        this.elements.set(virtualElement.id, virtualElement);

        return virtualElement;
    }

    getVirtualElement(id: number) {
        return this.elements.get(id);
    }
}