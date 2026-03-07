import { CjsEventCallback } from "../../types";
import { onLoad } from "./LoadEvent";

/**
 * Extecutes when slided by touch of mouse drag up by certain threshold
 * @param slideThreshold
 */
export function onSlideUp(f: CjsEventCallback, slideThreshold = 10) {
    return onLoad((cjsEvent) => {
        let startY = 0;
        let lastClientY = 0;

        const start = (event: Event) => {
            const e = event as MouseEvent | TouchEvent;
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            lastClientY = clientY;
            startY = clientY;
        }

        const move = (event: Event) => {
            const e = event as MouseEvent | TouchEvent;
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientY - 1 <= lastClientY;
            const deltaY = clientY - startY;

            if(!moveProgressed) {
                startY = 0;
                return;
            }

            if(deltaY < -1 *  slideThreshold) {
                f(cjsEvent)

                startY = 0;
            }

            lastClientY = clientY;
        }

        const target = cjsEvent.target as EventTarget;

        target.addEventListener('mousedown', start)
        target.addEventListener('touchstart', start)

        target.addEventListener('mousemove', move);
        target.addEventListener('touchmove', move);
    });
}