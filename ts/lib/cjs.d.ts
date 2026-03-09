declare module "cjs" {
declare class CjsLayout {
    private onLoadCallback;
    private dataState;
    /** attribute identifier of layout */
    attribute: string;
    elements: (layoutData: object | null) => CjsLayoutNode[][];
    /**
     * @param elements Function returning layout structure
     */
    constructor(elements: (layoutData: object | null) => CjsLayoutNode[][]);
    /**
     * Set function that will be executed when layout is loaded on website
     */
    onLoad(callback: (layoutData: object) => void): void;
    /**
     * Executes the onLoad function and sub components/layouts onLoad
     */
    _executeOnLoad(data: object): void;
    /**
     * Finds component in layout
     */
    select(component: CjsComponent): CjsComponent | null;
    /** Provides active layout data */
    get data(): object | null;
    /**
     * Reset layout data to default
     */
    resetToDefaultData(): this;
    /**
     * Sets global layout data
     */
    setData(data: object | null): this;
    /**
     * Converts layout into component with data
     */
    asComponentWithData(data: object): CjsComponent;
    /** Replace page content with layout */
    replacePage(): void;
    /** Get layout element from DOM */
    getElement(): HTMLElement | null;
    /** Check if layout exists in DOM */
    exists(): boolean;
    /** Build DOM structure */
    toElement(): HTMLElement;
    /** Hide layout */
    hide(): void;
    /** Show layout */
    show(): void;
    /** Rerender all layouts */
    rerenderLayouts(): this;
}

declare class CjsComponent<TData = any> {
    data: Partial<TData>;
    _renderData: TData;
    attribute: string;
    _cssStyle: string | null;
    _setStyle: Partial<CSSStyleDeclaration>;
    private renderedCssStyle;
    private onLoadCallback;
    private fillHeightData?;
    preSetData: Partial<TData>;
    /**
     * Function that renders html.
     */
    _(find: () => HTMLElement | null, layoutData: object): string;
    constructor();
    private mergeObjects;
    private getData;
    private camelToKebab;
    private injectStyle;
    private addAttributes;
    private addLazyIdentifiers;
    private getHtml;
    setData(data: Partial<TData>): this;
    render(data?: Partial<TData>): string;
    visualise(data?: Partial<TData>): HTMLElement;
    /**
     * Clones an component and sets data with argument (used for Layouts)
     */
    withData(data?: Partial<TData>): this;
    /**
     * Adds style to element using attribute `style="..."`
     */
    withStyle(style: Partial<Record<keyof CSSStyleDeclaration, string>>): any;
    toVirtualElement(): HTMLElement;
    toElement(ignoreReadyState?: boolean): HTMLElement | null;
    loadLayout(...layouts: CjsLayout[]): void;
    onLoad(callback: () => void): void;
    private executeOnLoad;
    hide(): void;
    show(): void;
    exists(): boolean;
    setDefaultData(data: Partial<TData>): this;
    querySelector<T extends HTMLElement = HTMLElement>(...selectors: string[]): (T | null) | (Array<T | null>);
    querySelectorAll(selector: string): HTMLElement[];
}

declare class CjsMutationEvent {
    target: HTMLElement;
    date: Date;
    constructor(target: HTMLElement, date: Date);
}

type AnyHTMLElement = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
/**
 * Class that determines the basic event
 */
declare class CjsEvent {
    event: Event | CjsMutationEvent;
    target: EventTarget | null;
    component: AnyHTMLElement | null;
    source: AnyHTMLElement;
    constructor(event: Event | CjsMutationEvent, source: AnyHTMLElement);
}

type CjsCursorTypes = "auto" | "default" | "none" | "context-menu" | "help" | "pointer" | "progress" | "wait" | "cell" | "crosshair" | "text" | "vertical-text" | "alias" | "copy" | "move" | "no-drop" | "not-allowed" | "grab" | "grabbing" | "e-resize" | "n-resize" | "ne-resize" | "nw-resize" | "s-resize" | "se-resize" | "sw-resize" | "w-resize" | "ew-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" | "col-resize" | "row-resize" | "all-scroll" | "zoom-in" | "zoom-out";
type CjsCustomEvents = "outerclick";
type CjsEventTypes = {
    events: (CjsCustomEvents | keyof HTMLElementEventMap)[];
};
type CjsLayoutNode = CjsComponent | CjsLayout | CjsLayoutNode[];
type CjsEventCallback = (cjsEvent: CjsEvent) => any;

/**
 * Executes when clicked ESC (Escape) keyboard key
 */
declare function onEscape(f: CjsEventCallback): string;

/**
 * Executes when hold down in touch or click on specific element
 */
declare function onHoldDown(f: CjsEventCallback, time?: number): string;

/**
 * Executes when element is being loaded into website
 */
declare function onLoad(f: CjsEventCallback): string;

/**
 * Executes when clicked outside the element
 */
declare function onOuterclick(f: CjsEventCallback): string;

/**
 * Executes when scrolled on the bottom of the element
 */
declare function onScrollBottom(f: CjsEventCallback): string;

/**
 * Extecutes when slided by touch of mouse drag down by certain threshold
 */
declare function onSlideDown(f: CjsEventCallback, slideThreshold?: number): string;

/**
 * Extecutes when slided by touch of mouse drag to left by certain threshold
 * @param slideThreshold triggers event when user slides by that amount of pixels
 * @param cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 */
declare function onSlideLeft(f: CjsEventCallback, slideThreshold?: number, cancelUpDownThreshold?: number): string;

/**
 * Extecutes when slided by touch of mouse drag to right by certain threshold
 * @param slideThreshold triggers event when user slides by that amount of pixels
 * @param cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 */
declare function onSlideRight(f: CjsEventCallback, slideThreshold?: number, cancelUpDownThreshold?: number): string;

/**
 * Extecutes when slided by touch of mouse drag up by certain threshold
 * @param slideThreshold
 */
declare function onSlideUp(f: CjsEventCallback, slideThreshold?: number): string;

/**
 * Disables all events in element, where this attribute is passed
 */
declare function off(...event: CjsEventTypes[]): string;

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

type CjsFilterTypes = "grayscale" | "blur" | "brightness" | "contrast" | "hue-rotate" | "invert" | "opacity" | "saturate" | "sepia";
type CjsFilterDirections = "standard" | "reverse";
interface CjsFilterOptions {
    filter: CjsFilterTypes;
    amount?: number;
    direction?: CjsFilterDirections;
    time?: number;
}
declare function createFilter(element: HTMLElement, options: CjsFilterOptions): Promise<void>;

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
    doRequest(): Promise<CjsRequestResult<TResponse>>;
}
declare const CjsRequestsUtil: {
    clearCache(): void;
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
 * String utility functions
 */
declare const CjsString: {
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

declare const CjsObject: {
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
    isEmpty(object: object): boolean;
};

/**
 * The maximum is inclusive and the minimum is inclusive
 */
declare function getRandom(min: number, max: number): number;

type SearchMode = "query" | "path";
type SearchListener = (data: {
    search: string;
    parts: string[];
    length: number;
}) => void;
declare class CjsSearch {
    #private;
    _mode: SearchMode;
    length: number;
    search: string;
    constructor();
    setMode(mode: SearchMode): void;
    setDisplayedOnScreen(display: boolean): this;
    onChange(callback: SearchListener): this;
    set(search: string, forceRerender?: boolean): this;
    setQuiet(search: string): this;
    update(quiet?: boolean): void;
    equals(text: string): boolean;
    startsWith(text: string): boolean;
    slice(start: number, end?: number | null): string;
    get(index: number): string | null;
    add(value: string): this;
    remove(count: number): this;
}
declare const Search: CjsSearch;

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

declare class CjsRipplePlugin extends CjsPlugin {
    private readonly attribute;
    private readonly animationTime;
    private readonly cssVariables;
    private applyEffect;
    private addStyles;
    enable(): void;
}

declare class CjsScaleClickPlugin extends CjsPlugin {
    private readonly attribute;
    private readonly animationTime;
    private readonly scales;
    private readonly keyframe;
    constructor();
    private handleTouch;
    private applyEvents;
    enable(): void;
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

declare class CjsScaleHoverPlugin extends CjsPlugin {
    private readonly attribute;
    private readonly animationTime;
    private readonly hoverScale;
    private addStyles;
    enable(): void;
}

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

/**
 * Framework lifecycle hooks
 */
interface CjsFrameworkEventsType {
    /**
     * Executes when layout is being loaded to component
     */
    onLoadLayout: (layout: CjsLayout) => void;
}
declare const CjsFrameworkEvents: CjsFrameworkEventsType;
/**
 * Debug information
 */
interface CjsDebugType {
    Style: {
        /** Displays all the media rules used on the website */
        Media: string[];
    };
}
declare const CjsDebug: CjsDebugType;

declare class CjsPage extends CjsLayout {
    readonly basename: string;
    /**
     * @param basename Page URL basename
     * @param elements Layout / Components
     */
    constructor(basename: string, elements: CjsLayoutNode[][]);
}

/**
 * Inits a webpage by a provided layout scheme
 */
declare function init(layout: CjsLayout | CjsPage): Promise<void>;

/**
 * Definition of Root website class
 */

type WebsiteDataInput = {
    title?: string;
    icon?: string | null;
};
declare class CjsRoot {
    private website;
    constructor();
    /**
     * Sets cursor for the body (whole website)
     */
    setCursor(cursor: CjsCursorTypes): void;
    setDocumentData(data: WebsiteDataInput): void;
    importStyle(path: string): Promise<void>;
}
declare const Root: CjsRoot;

export { CjsAnimation, CjsComponent, CjsDebug, CjsDownload, CjsFrameworkEvents, CjsGlobals, CjsKeyFrame, CjsLayout, CjsMobile, CjsNotificationPlugin, CjsObject, CjsPluginManager, CjsRequest, CjsRequestsUtil, CjsRipplePlugin, CjsScaleClickPlugin, CjsScaleHoverPlugin, CjsString, CjsTimings, CjsValidator, CjsWebSocket, CjsWindow, Root, Search, asset, createFilter, createHandle, getRandom, gif, init, jpg, off, onChange, onClick, onDoubleClick, onEscape, onFocus, onFocusOut, onHoldDown, onInput, onLoad, onMouseEnter, onMouseLeave, onMouseMove, onOuterclick, onResize, onScroll, onScrollBottom, onSlideDown, onSlideLeft, onSlideRight, onSlideUp, onTouchMove, png, strif, strmap, strmax, stror, svg };

}
