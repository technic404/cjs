import { CjsEventCallback } from "../../types";
import { CjsEventsManager } from "../CjsEventsManager";

/**
 * Executes when clicked outside the element
 */
export function onOuterclick(f: CjsEventCallback) {
    return CjsEventsManager.addCallback({
        eventName: "click",
        callback: (cjsEvent) => {
            const { event, source } = cjsEvent;

            if (!document.body.contains(source)) return;

            if (source !== event.target && !source.contains(event.target as Node | null)) {
                f(cjsEvent);
            }
        },
        applyToWindow: true
    });
}

