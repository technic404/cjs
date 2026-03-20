import { CjsNullEventCallback } from "../../types";
import { onLoad } from "./LoadEvent";

/**
 * Executes when clicked ESC (Escape) keyboard key
 */
export function onEscape(f: CjsNullEventCallback) {
    return onLoad(cjsEvent => {
        document.addEventListener('keydown', (event) => {
            const isEscape = event.key === "Escape" || event.key == "Esc";

            if(isEscape) f(cjsEvent);
        });
    });
}