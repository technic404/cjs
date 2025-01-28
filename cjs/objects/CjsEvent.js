/**
 * @class
 * @classdesc Class that determinates the basic event
 */
class CjsEvent {
    /**
     * @param {Event|ChangesObserverEvent} event
     * @param {HTMLElement} source element to witch the event was applied
     */
    constructor(event, source) {
        this.event = event;
        this.target = event.target;
        this.component = findParentThatHasAttribute(source, CJS_COMPONENT_PREFIX);
        this.source = source;
    }
}