import { CjsNullEventCallback } from "../../types";
import { onLoad } from "./LoadEvent";

/**
 * Executes when scrolled on the bottom of the element
 */
export function onScrollBottom(f: CjsNullEventCallback) {
    return onLoad(cjsEvent => {
        cjsEvent.source.addEventListener("scroll", () => {
            if (cjsEvent.source.scrollTop + cjsEvent.source.clientHeight >= cjsEvent.source.scrollHeight) {
                f(cjsEvent);
            }
        });
    });
}