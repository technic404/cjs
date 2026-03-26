import { CjsEventCallback, CjsNullEventCallback } from "../types";
import { CjsEventAttributePrefix } from "../constants";
import { CjsStringUtil } from "../utils/public/CjsStringUtil";

type EventCallback = {
    callback: CjsEventCallback,
    eventName: keyof HTMLElementEventMap,
    applyToWindow: boolean
}

type OnAddElementEventCallback = {
    callback: CjsNullEventCallback
}

export const CjsEventsManager = new class CjsEventsManager {
    #callbacksQueue = new Map<string, EventCallback>();
    #onAddElementCallbacks = new Map<string, OnAddElementEventCallback>();

    #createEventId = (): string => {
        let id = null;

        while(id === null || this.#callbacksQueue.has(id)) {
            id = CjsStringUtil.getRandom(16);
        }

        return id;
    }

    constructor() {

    }

    /**
     * @param eventCallback 
     * @returns attribute that have to applied to element, to properly detect element to add the click event
     */
    addCallback(eventCallback: EventCallback): string {
        const id = this.#createEventId();

        console.log('register', id);
        

        this.#callbacksQueue.set(id, eventCallback);

        return ` ${CjsEventAttributePrefix}${id}`;
    }

    addOnAddElementCallback(callback: CjsNullEventCallback): string {
        const id = this.#createEventId();

        this.#onAddElementCallbacks.set(id, { callback });

        return ` ${CjsEventAttributePrefix}${id}`;
    }

    hasCallback(id: string) { return this.#callbacksQueue.has(id); }
    getCallback(id: string) { return this.#callbacksQueue.get(id); }

    hasOnAddElementCallback(id: string) { return this.#onAddElementCallbacks.has(id); }
    getOnAddElementCallback(id: string) { return this.#onAddElementCallbacks.get(id); }
}