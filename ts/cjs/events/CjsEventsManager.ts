import { CjsEventCallback } from "../types";
import { CjsEventAttributePrefix } from "../constants";
import { CjsStringUtil } from "../utils/public/CjsStringUtil";

type EventCallback = {
    callback: CjsEventCallback,
    eventName: keyof HTMLElementEventMap,
    applyToWindow: boolean
}

export const CjsEventsManager = new class CjsEventsManager {
    #callbacksQueue = new Map<string, EventCallback>();

    constructor() {

    }

    /**
     * @param eventCallback 
     * @returns attribute that have to applied to element, to properly detect element to add the click event
     */
    addCallback(eventCallback: EventCallback): string {
        const id = CjsStringUtil.getRandom(16);

        this.#callbacksQueue.set(id, eventCallback);

        return ` ${CjsEventAttributePrefix}${id}`;
    }

    hasCallback(id: string) {
        return this.#callbacksQueue.has(id);
    }

    getCallback(id: string) {
        return this.#callbacksQueue.get(id);
    }
}