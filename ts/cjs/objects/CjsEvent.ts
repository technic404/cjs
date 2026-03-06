import { CJS_COMPONENT_PREFIX } from "../Constants";
import { CjsMutationEvent } from "../listeners/MutationListener";
import { findParentThatHasAttribute } from "../utils/ElementUtil";

type AnyHTMLElement = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

/**
 * Class that determines the basic event
 */
export class CjsEvent {
    event: Event | CjsMutationEvent;
    target: EventTarget | null;
    component: AnyHTMLElement | null;
    source: AnyHTMLElement;

    constructor(event: Event | CjsMutationEvent, source: AnyHTMLElement) {
        this.event = event;
        this.target = event.target;
        this.component = findParentThatHasAttribute(source, CJS_COMPONENT_PREFIX);
        this.source = source;
    }

}