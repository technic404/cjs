declare module "cjs" {
type Constructor$1<T> = new (...args: any[]) => T;
type AnyHTMLElement = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
type CjsEvent<T extends Event | null = Event | null> = {
    event: T;
    source: AnyHTMLElement;
};
type CjsEventCallback = (cjsEvent: CjsEvent<Event>) => any;
type CjsNullEventCallback = (cjsEvent: CjsEvent<null>) => any;
type CjsAnyEventCallback = (cjsEvent: CjsEvent<Event | null>) => any;
type CjsEventsMap = Record<string, (cjsEvent: CjsEvent<Event | null>) => any>;

/**
 * Executes when clicked ESC (Escape) keyboard key
 */
declare function onEscape(f: CjsNullEventCallback): string;

/**
 * Executes when hold down in touch or click on specific element
 */
declare function onHoldDown(f: CjsNullEventCallback, time?: number): string;

/**
 * Executes when element is being loaded into website
 */
declare function onLoad(callback: CjsNullEventCallback): string;

/**
 * Executes when clicked outside the element
 */
declare function onOuterclick(f: CjsEventCallback): string;

/**
 * Executes when scrolled on the bottom of the element
 */
declare function onScrollBottom(f: CjsNullEventCallback): string;

/**
 * Extecutes when slided by touch of mouse drag down by certain threshold
 */
declare function onSlideDown(f: CjsNullEventCallback, slideThreshold?: number): string;

/**
 * Extecutes when slided by touch of mouse drag to left by certain threshold
 * @param slideThreshold triggers event when user slides by that amount of pixels
 * @param cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 */
declare function onSlideLeft(f: CjsNullEventCallback, slideThreshold?: number, cancelUpDownThreshold?: number): string;

/**
 * Extecutes when slided by touch of mouse drag to right by certain threshold
 * @param slideThreshold triggers event when user slides by that amount of pixels
 * @param cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 */
declare function onSlideRight(f: CjsNullEventCallback, slideThreshold?: number, cancelUpDownThreshold?: number): string;

/**
 * Extecutes when slided by touch of mouse drag up by certain threshold
 * @param slideThreshold
 */
declare function onSlideUp(f: CjsNullEventCallback, slideThreshold?: number): string;

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

declare class CjsComponentsCollection {
    private components;
    constructor(components: NodeListOf<HTMLElement>);
    private call;
    _add(element: HTMLElement): void;
    /**
     * Sets the class name for all components
     */
    set className(token: string);
    /**
     * Returns the value of first component className
     */
    get className(): string | null;
    /**
     * classList wrapper for all components
     */
    get classList(): {
        add: (...tokens: string[]) => void;
        remove: (...tokens: string[]) => void;
        contains: (token: string) => boolean;
        toggle: (token: string, force?: boolean) => void;
        addExcept: (token: string, except: HTMLElement) => void;
        removeExcept: (token: string, except: HTMLElement) => void;
        addOnlyRemoveOthers: (token: string, only: HTMLElement) => void;
        removeOnlyAddOthers: (token: string, only: HTMLElement) => void;
    };
}

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

type CjsLayoutNode = Constructor$1<CjsComponent> | CjsComponent | CjsLayout | null | CjsLayoutNode[];
declare class CjsLayout<TData = any> {
    _preSetData: TData | null;
    _additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>> | null;
    _layoutObjects: Element[];
    elements: (data: TData) => CjsLayoutNode[][];
    /**
     * @param elements Function returning layout structure
     */
    constructor(elements: (data: TData | null) => CjsLayoutNode[][]);
    withData(preSetData: TData): CjsLayout;
    withStyle(additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>): any;
    private createErrorElement;
    /** Build DOM structure */
    visualise(): HTMLElement[];
    reRender(): void;
}

type Constructor<T> = new (...args: any[]) => T;
type FilleHeightData = {
    offset: number;
    maxHeight?: number;
};
type PrototypeData = {
    id: string;
    fillHeightData?: FilleHeightData;
};
declare class CjsComponent<TData = any> {
    __events: CjsEventsMap;
    private fillHeightData?;
    _cssStyle: string | null;
    _additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>;
    _defaultData: Partial<TData>;
    _preSetData: Partial<TData>;
    _id: string | null;
    element: HTMLElement | null;
    static _prototypesData: Map<Function, PrototypeData>;
    /**
     * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
     */
    constructor(preSetData?: Partial<TData> | null, additionalStyle?: Partial<Record<keyof CSSStyleDeclaration, string>> | null);
    /**
     * / 🔴 ------------ PRIVATE SCOPE ------------ 🔴 /
     */
    /** Creates id or pulls it from the map */
    private createId;
    /** Passes processed component style to global root style */
    private injectRootStyle;
    /** Provides the HTML string for the component */
    private getHtml;
    private getConstructorClass;
    /**
     *
     * / 🟢 ------------ PUBLIC SCOPE ------------ 🟢 /
     *
     */
    _addToPrototypeData(prototypeData: Partial<PrototypeData>): void;
    /** Function that provides template for base html structure */
    _template(): string;
    /** Function that provides actions for the component */
    _events(): CjsEventsMap;
    /** Functions that creates an type for component events */
    _wrapEvents(CjsEventsMap: CjsEventsMap): CjsEventsMap;
    /** Provides auto fill height of the component to the actual screen height (with optional offsets) */
    fillHeight(offset?: number, maxHeight?: number | undefined): void;
    getForms(): CjsForm[] | null;
    getComponents(): CjsComponentsCollection;
    /** Sets the data for the component */
    withData(data?: Partial<TData> | null): CjsComponent<TData>;
    /** Sets additional style for the component */
    withStyle(style: Partial<Record<keyof CSSStyleDeclaration, string>>): CjsComponent<TData>;
    /** Example: render HTML string */
    render(data?: Partial<TData> | null): string;
    /** Example: visualise component as element */
    visualise(data?: Partial<TData> | null): HTMLElement;
    /** Example: querySelector logic */
    querySelector(selectors: string): Element | null;
    /** Get first occurrence of the CjsComponent as HTMLElement */
    getFirst(): HTMLElement | null;
    /** Get all occurrences of the CjsComponent as HTMLElement */
    getAll(): NodeListOf<HTMLElement>;
    /** Loads CjsLayout inside CjsComponent */
    loadLayout(layout: CjsLayout): void;
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
    /** Central helper to get or create _id for a class */
    static getClassId<T extends CjsComponent<any>>(this: Constructor<T> & typeof CjsComponent): string;
    static getInstance(this: {
        new (...args: any[]): any;
    } & typeof CjsComponent, ...args: any[]): InstanceType<typeof this>;
    static getForms<T extends CjsComponent<any>>(this: Constructor<T>): CjsForm[] | null;
    static getComponents<T extends CjsComponent<any>>(this: Constructor<T>): any;
    /** Sets the data for the component */
    static withData<T extends CjsComponent<any>>(this: (new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T), data?: Partial<T extends CjsComponent<infer D> ? D : never>): T;
    /** Sets additional style for the component */
    static withStyle<T extends CjsComponent<any>>(this: (new (preSetData: any, additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>) => T), style: Partial<Record<keyof CSSStyleDeclaration, string>>): T;
    /** Example: render HTML string */
    static render<T extends CjsComponent<any>>(this: Constructor<T>, data?: Partial<T extends CjsComponent<infer D> ? D : never>): any;
    /** Example: visualise component as element */
    static visualise<T extends CjsComponent<any>>(this: Constructor<T>, data?: Partial<T extends CjsComponent<infer D> ? D : never>): HTMLElement;
    /** Example: querySelector logic */
    static querySelector<T extends CjsComponent<any>>(this: Constructor<T>, selectors: string): any;
    /** Other static methods can do the same */
    static fillHeight<T extends CjsComponent<any>>(this: Constructor<T>, offset?: number, maxHeight?: number): any;
    /** Loads CjsLayout inside CjsComponent */
    static loadLayout<T extends CjsComponent<any>>(this: Constructor<T>, layout: CjsLayout): any;
}

/**
 * Base class for all plugins
 */
declare abstract class CjsPlugin {
    /**
     * Enables the plugin
     */
    abstract enable(): void;
    /**
     * Adds CSS style rules to plugin style container
     */
    protected _addStyleRules(styleRules: Record<string, string[]>): void;
}

declare class CjsNotificationPlugin extends CjsPlugin {
    private readonly containerId;
    private readonly keyframe;
    private readonly themes;
    private addStyles;
    private createContainer;
    private createNotification;
    info(text: string): void;
    error(text: string): void;
    warning(text: string): void;
    success(text: string): void;
    enable(): void;
}

declare const CjsNotification: CjsNotificationPlugin;
interface CjsPluginConfig {
    ripple?: boolean;
    notification?: boolean;
    scaleClick?: boolean;
    scaleHover?: boolean;
}
declare const CjsPluginManager: {
    /**
     * Enables selected plugins
     */
    enable(plugins?: CjsPluginConfig): void;
};

declare const CjsObjectUtil: {
    /**
     * Returns values from keys if the value is not an object
     */
    getNonObjectValues<T extends Record<string, any>>(object: T): any[];
    /**
     * Deep merges two objects
     * object2 overwrites object1 by default
     */
    join<T extends Record<string, any>, U extends Record<string, any>>(object1: T, object2: U, overwrite?: boolean): T & U;
    /**
     * Deep copy of an object
     */
    copy<T>(object: T): T;
    /**
     * Removes keys that have nullable / empty values (mutates object)
     */
    filterOutNullableValues<T extends Record<string, any>>(object: T): T;
    isEmpty(object: object | null): boolean;
};

declare const CjsStringUtil: {
    getRandom(length: number, safeCharacters?: boolean): string;
    /**
     * Creates a unique numeric ID from a string
     * (DJB2 hash)
     */
    getHash(string: string): number;
    /**
     * Remove HTML tags from the input, keeping inner content
     */
    removeHtmlTags(input: string): string;
    /**
     * Capitalizes first letter of the string
     */
    capitalize(value: string): string;
};

/**
 * Animation helper utility
 */
declare class CjsAnimationExecutor {
    /**
     * Simple translateX animation
     */
    x(offset: number, time?: number): string;
    /**
     * Simple translateY animation
     */
    y(offset: number, time?: number): string;
    /**
     * Simple scale animation
     */
    scale(start: number, time?: number): string;
    /**
     * Adds temporary class to element and removes it after timeout
     */
    tempClass(element: HTMLElement, className: string, time?: number): void;
}
/**
 * Singleton
 */
declare const CjsAnimation: CjsAnimationExecutor;

/**
 * Base asset resolver
 *
 * Example:
 * <img src={asset("images/user.png")} />
 */
declare function asset(path: string): string;
/**
 * Shortcut of asset method, by default adds `svg/` prefix and `.svg` suffix.
 */
declare function svg(path: string): string;
/**
 * Shortcut of asset method, by default adds `images/` prefix and `.png` suffix.
 */
declare function png(path: string): string;
/**
 * Shortcut of asset method, by default adds `images/` prefix and `.jpg` suffix.
 */
declare function jpg(path: string): string;
/**
 * Shortcut of asset method, by default adds `gif/` prefix and `.gif` suffix.
 */
declare function gif(path: string): string;

/**
 * Global runtime state for the website
 */
declare const CjsDownload: {
    download(path: string, filename?: string | null): Promise<void>;
    downloadFile(data: BlobPart, mimeType: string, filename?: string | null): Promise<void>;
};

interface CjsGlobalsOptions {
    mouse: {
        /** determinates if mouse is not clicked (up) */
        up: boolean;
        /** determinates if mouse is clicked (down) */
        down: boolean;
        /** defines in which state is the mouse */
        state: "up" | "down";
    };
    window: {
        DOMContentLoaded: boolean;
    };
}
/**
 * Global runtime state for the website
 */
declare const CjsGlobals: CjsGlobalsOptions;

/**
 * Creates a typed handle function for CjsEvent
 *
 * Useful for autocomplete + better type inference
 */
declare function createHandle<T extends CjsEvent>(func: (event: T) => void): (event: T) => void;

/**
 * Timing function type
 */
type CjsAnimationTimingFunction = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | string;
/**
 * Style object for keyframe entry
 */
type CjsStyleProperties = Record<string, string | number>;
declare class CjsKeyFrame<T extends CjsStyleProperties = CjsStyleProperties> {
    private entries;
    private duration;
    private timingFunction;
    private keepEndingEntryStyle;
    private selector;
    private isImportant;
    private fillMode;
    setSelector(selector: string): this;
    setFillMode(fillMode: "none" | "forwards" | "backwards" | "both"): this;
    setEndingEntryStyle(keepEntry: boolean): this;
    addEntry(style: T): this;
    setDuration(duration: number): this;
    setTimingFunction(fn: CjsAnimationTimingFunction): this;
    setImportant(flag: boolean): this;
    getClass(options?: {
        reversed?: boolean;
    }): string;
}

/**
 * Mobile detection utilities
 */
declare const CjsMobile: {
    /**
     * Basic mobile device detection
     */
    isMobile(): boolean;
    /**
     * Checks if user is on iOS device
     */
    isIOS(): boolean;
};

declare class CjsRequestResult<T = any> {
    private statusCode;
    private response;
    private networkError;
    constructor(statusCode: number, response: T, networkError: boolean);
    getStatusCode(): number;
    isError(): boolean;
    isNetworkError(): boolean;
    text(): string;
    json(): T;
    blob(): Blob;
    toObjectURL(): string;
    getTranslation(): string;
    onStatus(code: number, callback: () => void): void;
}
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | string;
type ResponseType = "text" | "json" | "document" | "blob" | "arraybuffer";
type Callback<T> = (result: CjsRequestResult<T>) => void;
declare class CjsRequest<TResponse = any> {
    private url;
    private method;
    private onStartCallback;
    private onEndCallback;
    private onErrorCallback;
    private onSuccessCallback;
    private onProgressCallback;
    private cachedKeyPrefix;
    private query;
    private body;
    private headers;
    private files;
    private bodyKey;
    private cooldown;
    private cacheSeconds;
    private responseType;
    constructor(url: string, method: RequestMethod);
    private getCacheKey;
    private getCached;
    private setCached;
    private buildUrl;
    private sendBodyOrFiles;
    setQuery(query: Record<string, any>): this;
    setHeaders(headers: Record<string, any>): this;
    setBody(body: Record<string, any>): this;
    setFiles(files: Record<string, any>): this;
    setBodyKey(key: string): this;
    setCacheSeconds(seconds: number): this;
    setCacheMinutes(minutes: number): this;
    setCacheHours(hours: number): this;
    setResponseType(responseType: ResponseType): this;
    onStart(callback: () => any): this;
    onEnd(callback: Callback<TResponse>): this;
    onError(callback: Callback<any>): this;
    onSuccess(callback: () => any): this;
    onProgress(callback: (precentage: number, loaded: number, total: number, event: ProgressEvent) => void): this;
    doRequest(): Promise<CjsRequestResult<TResponse | null>>;
}
declare const CjsRequests: {
    clearCache(): void;
};

type SearchMode = "query" | "path";
type SearchListener = (data: {
    search: string;
    parts: string[];
    length: number;
}) => void;
declare const CjsSearch: {
    "__#private@#debugBoxId": string;
    "__#private@#displayOnScreen": boolean;
    "__#private@#updateWebsiteUrl": boolean;
    "__#private@#localStorageId": string;
    "__#private@#listeners": SearchListener[];
    _mode: SearchMode;
    length: number;
    search: string;
    "__#private@#getDesiredPart"(href: string): string;
    "__#private@#parseSearch"(search: string): string;
    "__#private@#updateUrl"(): void;
    "__#private@#createDebugBox"(): HTMLElement;
    setMode(mode: SearchMode): void;
    setDisplayedOnScreen(display: boolean): /*elided*/ any;
    onChange(callback: SearchListener): /*elided*/ any;
    set(search: string, forceRerender?: boolean): /*elided*/ any;
    setQuiet(search: string): /*elided*/ any;
    update(quiet?: boolean): void;
    equals(text: string): boolean;
    startsWith(text: string): boolean;
    slice(start: number, end?: number | null): string;
    get<T>(index: number): T | null;
    add(value: string): /*elided*/ any;
    remove(count: number): /*elided*/ any;
};

/**
 * Array.map but returns string (useful for templates)
 */
declare function strmap<T>(array: T[], callback: (element: T, index: number) => string): string;
/**
 * Conditional string helper
 */
declare function strif(condition: boolean, value: string): string;
/**
 * Truncates string and adds "..." if it exceeds max length
 */
declare function strmax(value: string, max: number): string;
/**
 * Returns fallback if string is empty / null / undefined
 */
declare function stror(value: string | null | undefined, fallback: string): string;

/**
 * Timing utilities
 */
declare const CjsTimings: {
    /**
     * Creates a delay (sleep)
     */
    sleep(ms: number): Promise<void>;
};

/**
 * Validation utility
 */
declare const CjsValidator: {
    /**
     * Checks if provided string is a valid email
     */
    isEmail(value: string): boolean;
};

type CaptureCallback = (event: MessageEvent) => void;
/**
 * WebSocket wrapper utility
 */
declare class CjsWebSocket {
    private webSocket;
    private captures;
    private isOpened;
    private waitingSendRequests;
    /**
     * Connects to WebSocket
     */
    connect(url: string): this;
    /**
     * Sends raw data to WebSocket
     */
    send(data: string | ArrayBuffer | Blob): this;
    /**
     * Sends JSON data (auto stringified)
     */
    sendJson(json: unknown): this;
    /**
     * Creates a capture.
     * When any message is received — the callback executes.
     *
     * @returns capture id
     */
    createCapture(callback: CaptureCallback): string;
    /**
     * Removes capture
     */
    removeCapture(id: string): this;
    /**
     * Checks if capture exists
     */
    hasCapture(id: string): boolean;
    /**
     * Closes websocket safely
     */
    close(code?: number, reason?: string): void;
}

/**
 * Utility providing various functions that support window management
 */
declare const CjsWindow: {
    /**
     * Opens a url within a new tab / target
     */
    open(href: string, target?: "_blank" | "_self" | "_parent" | "_top"): void;
};

declare function init(layout: CjsLayout): void;

export { CjsAnimation, CjsComponent, CjsDownload, CjsGlobals, CjsKeyFrame, CjsLayout, CjsMobile, CjsNotification, CjsObjectUtil, CjsPluginManager, CjsRequest, CjsRequests, CjsSearch, CjsStringUtil, CjsTimings, CjsValidator, CjsWebSocket, CjsWindow, asset, createHandle, gif, init, jpg, onChange, onClick, onDoubleClick, onEscape, onFocus, onFocusOut, onHoldDown, onInput, onLoad, onMouseEnter, onMouseLeave, onMouseMove, onOuterclick, onResize, onScroll, onScrollBottom, onSlideDown, onSlideLeft, onSlideRight, onSlideUp, onTouchMove, png, strif, strmap, strmax, stror, svg };
export type { CjsAnyEventCallback, CjsEventsMap };

}
