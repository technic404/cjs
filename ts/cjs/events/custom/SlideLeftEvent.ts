import { CjsEventCallback } from "../../types";
import { onLoad } from "./LoadEvent";

/**
 * Extecutes when slided by touch of mouse drag to left by certain threshold
 * @param slideThreshold triggers event when user slides by that amount of pixels
 * @param cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 */
export function onSlideLeft(f: CjsEventCallback, slideThreshold = 50, cancelUpDownThreshold = 50) {
    return onLoad((cjsEvent) => {
        let mouse = { startX: 0, startY: 0, lastX: 0, lastY: 0 };

        const start = (event: Event) => {
            const e = event as TouchEvent | MouseEvent;
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            mouse.lastX = clientX;
            mouse.startX = clientX;
            mouse.lastY = clientY;
            mouse.startY = clientY;
        }

        const move = (event: Event) => {
            const e = event as TouchEvent | MouseEvent;
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientX - 1 <= mouse.lastX;
            const deltaX = clientX - mouse.startX;
            const deltaY = clientY - mouse.startY;

            if(cancelUpDownThreshold !== -1 && cancelUpDownThreshold < Math.abs(deltaY)) {
                mouse.startX = 0;
                return;
            }

            if(!moveProgressed) {
                mouse.startX = 0;
                return;
            }

            if(deltaX < -1 * slideThreshold) {
                f(cjsEvent)

                mouse.startX = 0;
            }

            mouse.lastX = clientX;
        }

        const target = cjsEvent.target as EventTarget;

        target.addEventListener('mousedown', start)
        target.addEventListener('touchstart', start)

        target.addEventListener('mousemove', move);
        target.addEventListener('touchmove', move);
    });
}