export type Constructor<T> = new (...args: any[]) => T;

export type AnyHTMLElement = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

export type CjsEvent<T extends Event | null = Event | null> = {
  event: T;
  source: AnyHTMLElement;
};

export type CjsEventCallback = (cjsEvent: CjsEvent<Event>) => any;
export type CjsNullEventCallback = (cjsEvent: CjsEvent<null>) => any;
export type CjsEventsMap = Record<string, (cjsEvent: CjsEvent<Event | null>) => any>;