import { CjsObjectAttributePrefix, CjsGlobalStyleTagId } from "../constants";
import { onLoad } from "../events/custom/LoadEvent";
import { _CSSProcessor } from "../processors/css/CSSProcessor";
import { CjsEvent, CjsEventsMap } from "../types";
import { _CjsLoggerUtil } from "../utils/protected/_CjsLoggerUtil";
import { _DOMElementsUtil } from "../utils/protected/_DOMElementsUtil";
import { _StringHTMLElementsUtil } from "../utils/protected/_StringHTMLElementsUtil";
import { CjsObjectUtil } from "../utils/public/CjsObjectUtil";
import { CjsStringUtil } from "../utils/public/CjsStringUtil";
import { CjsRequest } from "../utils/user-helpers/CjsRequestsUtil";
import { CjsForm } from "./CjsForm";

type Constructor<T> = new (...args: any[]) => T;
type StaticCast<T> = (Constructor<T> & typeof CjsComponent);

const CjsComponentInjectedStylePaths: string[] = [];

export class CjsComponent<TData = any> {
    public __events: CjsEventsMap = {};

    private fillHeightData?: { offset: number; maxHeight?: number };

    public _cssStyle: string | null = null;
    public _additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>> = {};

    public _defaultData: Partial<TData> = {} as Partial<TData>;
    public _preSetData: Partial<TData> = {};

    public _id: string | null = null;

    public element: HTMLElement | null = null;

    static _ids = new Map<Function, string>();

    /**
     * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
     */

    constructor(
        preSetData: Partial<TData> | null = null, 
        additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>> | null = null
    ) {
        if(preSetData) this._preSetData = CjsObjectUtil.copy(preSetData);

        if(additionalStyle) this._additionalStyle = CjsObjectUtil.copy(additionalStyle);

        this.createId();
    }


    /**
     * / 🔴 ------------ PRIVATE SCOPE ------------ 🔴 /
     */

    /** Creates id or pulls it from the map */
    private createId() {
        const idsMap = (this.constructor as typeof CjsComponent)._ids;
        const values = Array.from(idsMap.values());

        if(idsMap.has(this.constructor)) {
            this._id = idsMap.get(this.constructor)!;
        } else {
            this._id = null;

            while(this._id === null || values.includes(this._id)) {
                this._id = `c${CjsStringUtil.getRandom(6)}`;
            }

            idsMap.set(this.constructor, this._id!);
        }
    }

    /** Passes processed component style to global root style */
    private async injectRootStyle() {
        if(!this._cssStyle) return;

        const stylePath = this._cssStyle.startsWith("./") ? this._cssStyle.slice(2) : this._cssStyle;
        const request = await new CjsRequest(stylePath, "get").doRequest();

        if (request.isError()) {
            _CjsLoggerUtil.error(`Error occurred while importing style (&e${stylePath}&r)`);
            return;
        }

        const cssText = request.text();
        const style = document.head.querySelector<HTMLStyleElement>(`[id="${CjsGlobalStyleTagId}"]`);

        if (!style) return;

        style.innerHTML += _CSSProcessor.processComponentStyle(`[${CjsObjectAttributePrefix}="${this._id}"]`, cssText);
    }

    /** Provides the HTML string for the component */
    private getHtml() {
        let html = this._template();

        const onLoadCallbacks: ((cjsEvent: CjsEvent<null>) => any)[] = [];

        if(this._cssStyle) {
            const alreadyCreatedCssClass = CjsComponentInjectedStylePaths.includes(this._cssStyle);
            
            if(!alreadyCreatedCssClass) {
                this.injectRootStyle();

                CjsComponentInjectedStylePaths.push(this._cssStyle);
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

        if(this.fillHeightData !== undefined) {
            const { maxHeight, offset } = this.fillHeightData;
            const resize = (cjsEvent: CjsEvent<null>) => {
                const { source } = cjsEvent;

                source.style.height = `${
                    maxHeight !== undefined && window.innerHeight > maxHeight 
                    ? maxHeight 
                    : window.innerHeight + offset
                }px`
            };

            onLoadCallbacks.push((cjsEvent) => {
                window.addEventListener('resize', _ => resize(cjsEvent));
            });
        }

        html = _StringHTMLElementsUtil.injectAttribute(html, onLoad((cjsEvent) => {
            onLoadCallbacks.forEach(onLoadCallback => onLoadCallback(cjsEvent));

            this.element = cjsEvent.source;
        }), "");

        html = _StringHTMLElementsUtil.injectAttribute(html, CjsObjectAttributePrefix, this._id!);

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
    public _events(): CjsEventsMap {
        return {} as CjsEventsMap;
    }

    /** Functions that creates an type for component events */
    public _wrapEvents(CjsEventsMap: CjsEventsMap): CjsEventsMap {
        return CjsEventsMap;
    }

    /** Provides component as an HTML element */
    public visualise(preSetData: Partial<TData> | null = null) {
        if(preSetData) this._preSetData = CjsObjectUtil.copy(preSetData);
        
        return _DOMElementsUtil.HTMLToElement(this.getHtml());
    }

    /** Provides auto fill height of the component to the actual screen height (with optional offsets) */
    public fillHeight(offset: number = 0, maxHeight: number | undefined = undefined) {
        this.fillHeightData = {
            offset,
            maxHeight
        };
    }

    public getForms(): CjsForm[] | null {
        const element = this.element;

        if(!element) return null;

        return Array.from(
            element.querySelectorAll("form"), 
            (el) => new CjsForm(el)
        );
    }

    /** Get first occurrence of the CjsComponent as HTMLElement */
    public getFirst() {
        return document.body.querySelector<HTMLElement>(`[${CjsObjectAttributePrefix}="${this._id}"]`);
    }

    /** Get all occurrences of the CjsComponent as HTMLElement */
    public getAll() {
        return document.body.querySelectorAll<HTMLElement>(`[${CjsObjectAttributePrefix}="${this._id}"]`);
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

    

    /** Central helper to get or create _id for a class */
    static getClassId<T extends CjsComponent<any>>(this: Constructor<T> & typeof CjsComponent) {
        let id = this._ids.get(this);

        if (!id) {
            id = new this()._id!;
            this._ids.set(this, id);
        }
        
        return id;
    }

    static getInstance<T extends CjsComponent<any>>(
        this: new (...args: any[]) => CjsComponent<any>,
        ...args: any[]
    ) {
        const cls = this as unknown as (Constructor<T> & typeof CjsComponent);
        const instance = new cls(...args);
        instance._id = cls.getClassId();
        return instance;
    }

    static getForms<T extends CjsComponent<any>>(
        this: Constructor<T>
    ): CjsForm[] | null {
        const element = (this as StaticCast<T>).getInstance().getFirst();

        if(!element) return null;

        return Array.from(
            element.querySelectorAll("form"), 
            (el) => new CjsForm(el)
        );
    }

    /** Sets the data for the component */ 
    static withData<T extends CjsComponent<any>>( 
        this: (new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T), 
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {} 
    ) {
        return (this as StaticCast<T>).getInstance(data); 
    } 
    
    /** Sets additional style for the component */ 
    static withStyle<T extends CjsComponent<any>>(
         this: (new (preSetData: any, additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>) => T), 
         style: Partial<Record<keyof CSSStyleDeclaration, string>> 
    ) { 
        return (this as StaticCast<T>).getInstance(null, style);
    }

    /** Example: render HTML string */
    static render<T extends CjsComponent<any>>(
        this: Constructor<T>,
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return (this as StaticCast<T>).getInstance(data).getHtml();
    }

    /** Example: visualise component as element */
    static visualise<T extends CjsComponent<any>>(
        this: Constructor<T>,
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return _DOMElementsUtil.HTMLToElement((this as StaticCast<T>).getInstance(data).getHtml());
    }

    /** Example: querySelector logic */
    static querySelector<T extends CjsComponent<any>>(
        this: Constructor<T>,
        selectors: string
    ) {
        return (this as StaticCast<T>).getInstance().getFirst()!.querySelector(selectors);
    }

    /** Other static methods can do the same */
    static fillHeight<T extends CjsComponent<any>>(
        this: Constructor<T>,
        offset: number = 0,
        maxHeight?: number
    ) {
        return (this as StaticCast<T>).getInstance().fillHeight(offset, maxHeight);
    }
}