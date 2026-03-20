import { CjsNullEventCallback } from "../../types";
import { onLoad } from "./LoadEvent";

/**
 * Executes when hold down in touch or click on specific element
 */
export function onHoldDown(f: CjsNullEventCallback, time = 500) {
    return onLoad(cjsEvent => {
        let timeoutId: any = 0;

        const cancel = () => { clearTimeout(timeoutId); }
        const down = () => {
            timeoutId = setTimeout(() => {
                f(cjsEvent);
            }, time);
        }

        cjsEvent.source.addEventListener('mousedown', down);
        cjsEvent.source.addEventListener('touchstart', down);

        cjsEvent.source.addEventListener('mouseup', cancel);
        cjsEvent.source.addEventListener('mousemove', cancel);
        cjsEvent.source.addEventListener('touchend', cancel);
        cjsEvent.source.addEventListener('touchcancel', cancel);
        cjsEvent.source.addEventListener('touchmove', cancel);
    })
}