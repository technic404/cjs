import { CjsEventCallback } from "../types";
import { CjsEventsManager } from "./CjsEventsManager";

const handle = (eventName: keyof HTMLElementEventMap, callback: CjsEventCallback, applyToWindow: boolean = false) =>
    CjsEventsManager.addCallback({
        eventName,
        callback,
        applyToWindow
    });

export const onChange = (f: CjsEventCallback) => handle("change", f);
export const onClick = (f: CjsEventCallback) => handle("click", f);
export const onDoubleClick = (f: CjsEventCallback) => handle("dblclick", f);
export const onFocus = (f: CjsEventCallback) => handle("focus", f);
export const onFocusOut = (f: CjsEventCallback) => handle("focusout", f);
export const onInput = (f: CjsEventCallback) => handle("input", f);
export const onMouseEnter = (f: CjsEventCallback) => handle("mouseenter", f);
export const onMouseLeave = (f: CjsEventCallback) => handle("mouseleave", f);
export const onMouseMove = (f: CjsEventCallback) => handle("mousemove", f);
export const onResize = (f: CjsEventCallback) => handle("resize", f, true);
export const onScroll = (f: CjsEventCallback) => handle("scroll", f);
export const onTouchMove = (f: CjsEventCallback) => handle("touchmove", f);
// export const on = (f: CjsEventCallback) => handle("", f);
