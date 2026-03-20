import { CjsGlobalStyleTagId } from "../constants";
import { _CSSProcessor } from "../processors/css/CSSProcessor";
import { CjsEvent } from "../types";
import { _CjsLoggerUtil } from "../utils/protected/_CjsLoggerUtil";
import { _DOMElementsUtil } from "../utils/protected/_DOMElementsUtil";
import { _StringHTMLElementsUtil } from "../utils/protected/_StringHTMLElementsUtil";
import { CjsObjectUtil } from "../utils/public/CjsObjectUtil";
import { CjsStringUtil } from "../utils/public/CjsStringUtil";
import { CjsRequest } from "../utils/user-helpers/CjsRequestsUtil";
import { CjsForm } from "./CjsForm";

type EventsMap = Record<string, (e: object) => any>;

const CjsComponentTakenCssClasses = new Map<string, string>();

export class CjsComponent<TData = any> {
    public __events: EventsMap = {};

    private fillHeightData?: { offset: number; maxHeight?: number };

    public _cssStyle: string | null = null;
    public _cssClassName: string | null = null;
    public _additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>> = {};

    public _defaultData: Partial<TData> = {} as Partial<TData>;
    public _preSetData: Partial<TData> = {};

    /**
     * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
     */

    constructor(
        preSetData: Partial<TData> | null = null, 
        additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>> | null = null
    ) {
        if(preSetData) this._preSetData = CjsObjectUtil.copy(preSetData);

        if(additionalStyle) this._additionalStyle = CjsObjectUtil.copy(additionalStyle);
    }

    /**
     * / 🔴 ------------ PRIVATE SCOPE ------------ 🔴 /
     */

    /** Passes processed component style to global root style */
    private async injectRootStyle() {
        if(!this._cssStyle || !this._cssClassName) return;

        const stylePath = this._cssStyle.startsWith("./") ? this._cssStyle.slice(2) : this._cssStyle;
        const request = await new CjsRequest(stylePath, "get").doRequest();

        if (request.isError()) {
            _CjsLoggerUtil.error(`Error occurred while importing style (&e${stylePath}&r)`);
            return;
        }

        const cssText = request.text();
        const style = document.head.querySelector<HTMLStyleElement>(`[id="${CjsGlobalStyleTagId}"]`);

        if (!style) return;

        style.innerHTML += _CSSProcessor.processComponentStyle(`.${this._cssClassName}`, cssText);
    }

    /** Provides the HTML string for the component */
    private getHtml() {
        let html = this._template();

        if(this._cssStyle) {
            const alreadyCreatedCssClass = CjsComponentTakenCssClasses.has(this._cssStyle)
            const className = alreadyCreatedCssClass
                ? CjsComponentTakenCssClasses.get(this._cssStyle)!
                : (() => {
                    let className = null;

                    const takenClassNames = Array.from(CjsComponentTakenCssClasses.values());

                    while(className == null || takenClassNames.includes(className)) {
                        className = CjsStringUtil.getRandom(6);
                    }

                    CjsComponentTakenCssClasses.set(this._cssStyle!, className);

                    return className;
                })();
            
            this._cssClassName = className;
            
            html = _StringHTMLElementsUtil.injectAttribute(
                html,
                "class", 
                className
            );
            
            if(!alreadyCreatedCssClass) {
                this.injectRootStyle();
            }
        }

        if(!CjsObjectUtil.isEmpty(this._additionalStyle)) {
            html = _StringHTMLElementsUtil.injectAttribute(
                html,
                "style", 
                Object.entries(this._additionalStyle)
                    .map(e => `${e[0]}: ${e[1]}`)
                    .join("; ")
            );
        }

        return html;
    }

    /**
     * 
     * / 🟢 ------------ PUBLIC SCOPE ------------ 🟢 /
     * 
     */

    /** Function that provides template for base html structure */
    public _template(): string {
        return "";
    }

    /** Function that provides actions for the component */
    public _events(): EventsMap {
        return {} as EventsMap;
    }

    /** Provides component as an HTML element */
    public visualise(preSetData: Partial<TData> | null = null) {
        if(preSetData) this._preSetData = CjsObjectUtil.copy(preSetData);
        
        return _DOMElementsUtil.HTMLToElement(this.getHtml());
    }
    
    /**
     * 
     * / 🔵 ------------ GETTERS SCOPE ------------ 🔵 /
     * 
     */
    
    /** Provides merged component data including default data and pre-set data */
    get data(): TData {
        return CjsObjectUtil.copy(
            CjsObjectUtil.join(this._defaultData, this._preSetData)
        ) as TData;
    }

    /** Provides all form elements within the component as CjsForm instances */
    get forms(): CjsForm[] {
        return Array.from(
            _DOMElementsUtil.HTMLToElement(this.getHtml()).querySelectorAll("form"), 
            (el) => new CjsForm(el)
        );
    }
    
    /** Provides all event handlers for the component */
    get events() : ReturnType<this["_events"]> {
        const _this = this;

        return new Proxy(this.__events, {
            get(target, prop: string) {
                if (prop in target) {
                    return target[prop];
                }
                return (event: CjsEvent) => {
                    _this._events()[prop](event);
                };
                
                return `${prop}`;
            }
        }) as ReturnType<this["_events"]>;
    }

    /**
     * 
     * / 🟡 ------------ STATIC SCOPE ------------ 🟡 /
     * 
     */

    /** Provides a rendered HTML string for the component */
    static render<T extends CjsComponent<any>>(
        this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T,
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return new this(data).getHtml();
    }

    /** Provides a visualised HTML element for the component */
    static visualise<T extends CjsComponent<any>>(
        this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T,
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return _DOMElementsUtil.HTMLToElement(new this(data).getHtml());
    }

    /** Sets the data for the component */
    static withData<T extends CjsComponent<any>>(
        this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T, 
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return new this(data);
    }

    /** Sets additional style for the component */
    static withStyle<T extends CjsComponent<any>>(
        this: new (preSetData: any, additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>) => T,
        style: Partial<Record<keyof CSSStyleDeclaration, string>>
    ) {
        return new this(null, style);
    }
}