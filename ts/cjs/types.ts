import { CjsComponent } from "./objects/CjsComponent";
import { CjsEvent } from "./objects/CjsEvent";
import { CjsLayout } from "./objects/CjsLayout";

export type CjsCursorTypes =
    | "auto"
    | "default"
    | "none"
    | "context-menu"
    | "help"
    | "pointer"
    | "progress"
    | "wait"
    | "cell"
    | "crosshair"
    | "text"
    | "vertical-text"
    | "alias"
    | "copy"
    | "move"
    | "no-drop"
    | "not-allowed"
    | "grab"
    | "grabbing"
    | "e-resize"
    | "n-resize"
    | "ne-resize"
    | "nw-resize"
    | "s-resize"
    | "se-resize"
    | "sw-resize"
    | "w-resize"
    | "ew-resize"
    | "ns-resize"
    | "nesw-resize"
    | "nwse-resize"
    | "col-resize"
    | "row-resize"
    | "all-scroll"
    | "zoom-in"
    | "zoom-out";

export type CjsCustomEvents = "outerclick";
export type CjsCommonEvent = keyof HTMLElementEventMap;

export type CjsEventTypes = {
    events: (CjsCustomEvents|keyof HTMLElementEventMap)[];
};

export type Constructor<T> = new (...args: any[]) => T;

export type CjsLayoutNode = Constructor<CjsComponent> | CjsComponent | CjsLayout | CjsLayoutNode[];

export type CjsEventCallback = (cjsEvent: CjsEvent) => any;