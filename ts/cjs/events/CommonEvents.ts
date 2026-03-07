import { functionMappings } from "../FunctionMappings";
import { CjsEvent } from "../objects/CjsEvent";
import { CjsCommonEvent, CjsEventCallback } from "../types";

const handle = (type: CjsCommonEvent, f: CjsEventCallback) =>
    functionMappings.add(type, (event, source) => f(new CjsEvent(event, source)));

export const onChange = (f: CjsEventCallback) => handle("change", f);
export const onClick = (f: CjsEventCallback) => handle("click", f);
export const onDoubleClick = (f: CjsEventCallback) => handle("dblclick", f);
export const onFocus = (f: CjsEventCallback) => handle("focus", f);
export const onFocusOut = (f: CjsEventCallback) => handle("focusout", f);
export const onInput = (f: CjsEventCallback) => handle("input", f);
export const onMouseEnter = (f: CjsEventCallback) => handle("mouseenter", f);
export const onMouseLeave = (f: CjsEventCallback) => handle("mouseleave", f);
export const onMouseMove = (f: CjsEventCallback) => handle("mousemove", f);
export const onResize = (f: CjsEventCallback) => handle("resize", f);
export const onScroll = (f: CjsEventCallback) => handle("scroll", f);
export const onTouchMove = (f: CjsEventCallback) => handle("touchmove", f);
// export const on = (f: CjsEventCallback) => handle("", f);
