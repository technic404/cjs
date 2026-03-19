declare module "cjs" {
import { CjsLayout as CjsLayout$1 } from 'cjs';

interface CjsFormSerializeOptions {
    checkboxesReadType?: "array" | "single";
    includeNoNames?: boolean;
}
/**
 * Object intended to manage the form data
 */
declare class CjsForm {
    #private;
    constructor(element: HTMLFormElement);
    serialize(options?: CjsFormSerializeOptions): Record<string | number, any>;
}

type EventsMap = Record<string, (e: object) => any>;
declare class CjsComponent<TData = any> {
    __events: EventsMap;
    private fillHeightData?;
    _cssStyle: string | null;
    _cssClassName: string | null;
    _additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>;
    _defaultData: Partial<TData>;
    _preSetData: Partial<TData>;
    /**
     * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
     */
    constructor(preSetData?: Partial<TData> | null, additionalStyle?: Partial<Record<keyof CSSStyleDeclaration, string>> | null);
    /**
     * / 🔴 ------------ PRIVATE SCOPE ------------ 🔴 /
     */
    /** Provides the HTML string for the component */
    private getHtml;
    /**
     *
     * / 🟢 ------------ PUBLIC SCOPE ------------ 🟢 /
     *
     */
    /** Function that provides template for base html structure */
    _template(): string;
    /** Function that provides actions for the component */
    _events(): EventsMap;
    /** Provides component as an HTML element */
    visualise(preSetData?: Partial<TData> | null): HTMLElement;
    /**
     *
     * / 🔵 ------------ GETTERS SCOPE ------------ 🔵 /
     *
     */
    /** Provides merged component data including default data and pre-set data */
    get data(): TData;
    /** Provides all form elements within the component as CjsForm instances */
    get forms(): CjsForm[];
    /** Provides all event handlers for the component */
    get events(): ReturnType<this["_events"]>;
    /**
     *
     * / 🟡 ------------ STATIC SCOPE ------------ 🟡 /
     *
     */
    /** Provides a rendered HTML string for the component */
    static render<T extends CjsComponent<any>>(this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T, data?: Partial<T extends CjsComponent<infer D> ? D : never>): string;
    /** Provides a visualised HTML element for the component */
    static visualise<T extends CjsComponent<any>>(this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T, data?: Partial<T extends CjsComponent<infer D> ? D : never>): HTMLElement;
    /** Sets the data for the component */
    static withData<T extends CjsComponent<any>>(this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T, data?: Partial<T extends CjsComponent<infer D> ? D : never>): T;
    /** Sets additional style for the component */
    static withStyle<T extends CjsComponent<any>>(this: new (preSetData: any, additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>) => T, style: Partial<Record<keyof CSSStyleDeclaration, string>>): T;
}

declare class CjsMutationEvent {
    target: HTMLElement;
    constructor(target: HTMLElement);
}

type Constructor<T> = new (...args: any[]) => T;
type AnyHTMLElement = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
type CjsEvent = {
    event: Event | CjsMutationEvent;
    source: AnyHTMLElement;
};
type CjsEventCallback = (cjsEvent: CjsEvent) => any;

type CjsLayoutNode = Constructor<CjsComponent> | CjsComponent | CjsLayout | CjsLayoutNode[];
declare class CjsLayout<TData = any> {
    _preSetData: TData | null;
    elements: (data: TData) => CjsLayoutNode[][];
    /**
     * @param elements Function returning layout structure
     */
    constructor(elements: (data: TData | null) => CjsLayoutNode[][]);
    withData(preSetData: TData): CjsLayout;
    private createErrorElement;
    /** Build DOM structure */
    visualise(): HTMLElement[];
}

declare function init(layout: CjsLayout$1): void;

declare const onChange: (f: CjsEventCallback) => string;
declare const onClick: (f: CjsEventCallback) => string;
declare const onDoubleClick: (f: CjsEventCallback) => string;
declare const onFocus: (f: CjsEventCallback) => string;
declare const onFocusOut: (f: CjsEventCallback) => string;
declare const onInput: (f: CjsEventCallback) => string;
declare const onMouseEnter: (f: CjsEventCallback) => string;
declare const onMouseLeave: (f: CjsEventCallback) => string;
declare const onMouseMove: (f: CjsEventCallback) => string;
declare const onResize: (f: CjsEventCallback) => string;
declare const onScroll: (f: CjsEventCallback) => string;
declare const onTouchMove: (f: CjsEventCallback) => string;

export { CjsComponent, CjsLayout, init, onChange, onClick, onDoubleClick, onFocus, onFocusOut, onInput, onMouseEnter, onMouseLeave, onMouseMove, onResize, onScroll, onTouchMove };

}
