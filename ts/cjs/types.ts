import { CjsMutationEvent } from "./listeners/CjsMutationListener";

export type Constructor<T> = new (...args: any[]) => T;

export type AnyHTMLElement = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

export type CjsEvent = {
    event: Event | CjsMutationEvent;
    source: AnyHTMLElement;
};

export type CjsEventCallback = (cjsEvent: CjsEvent) => any;