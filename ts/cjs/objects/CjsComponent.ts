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
import { CjsComponentsCollection } from "./CjsComponentsCollection";
import { CjsForm } from "./CjsForm";
import { CjsLayout } from "./CjsLayout";

type Constructor<T> = new (...args: any[]) => T;
type StaticCast<T> = (Constructor<T> & typeof CjsComponent);

const CjsComponentInjectedStylePaths: string[] = [];

type FilleHeightData = {
    offset: number
    maxHeight?: number
}

type PrototypeData = {
    id: string
    fillHeightData?: FilleHeightData
}

export class CjsComponent<TData = any> {
    public __events: CjsEventsMap = {};

    private fillHeightData?: { offset: number; maxHeight?: number };

    public _cssStyle: string | null = null;
    public _additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>> = {};

    public _defaultData: Partial<TData> = {} as Partial<TData>;
    public _preSetData: Partial<TData> = {};

    public _id: string | null = null;

    public element: HTMLElement | null = null;

    static _prototypesData = new Map<Function, PrototypeData>();

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
        const prototypes = (this.constructor as typeof CjsComponent)._prototypesData;
        const ids = Array.from(prototypes.values()).map(e => e.id);

        if(prototypes.has(this.constructor)) {
            this._id = prototypes.get(this.constructor)!.id;
        } else {
            this._id = null;

            while(this._id === null || ids.includes(this._id)) {
                this._id = CjsStringUtil.getRandom(6);
            }

            prototypes.set(this.constructor, { id: this._id });
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

        style.innerHTML += _CSSProcessor.processComponentStyle(`[${CjsObjectAttributePrefix}*="${this._id}"]`, cssText);
    }

    /** Provides the HTML string for the component */
    private getHtml() {
        let html = this._template();

        const prototypeData = (this.constructor as typeof CjsComponent)._prototypesData.get(this.constructor);
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

        if(prototypeData && "fillHeightData" in prototypeData) {
            const { maxHeight, offset } = prototypeData.fillHeightData!;
            const resize = (cjsEvent: CjsEvent<null>) => {
                const { source } = cjsEvent;

                source.style.height = `${
                    maxHeight !== undefined && window.innerHeight > maxHeight 
                    ? maxHeight 
                    : window.innerHeight + offset
                }px`;

            };

            onLoadCallbacks.push((cjsEvent) => {
                window.addEventListener('resize', _ => resize(cjsEvent));

                resize(cjsEvent);
            });

        }

        html = _StringHTMLElementsUtil.injectAttribute(html, onLoad((cjsEvent) => {
            onLoadCallbacks.forEach(onLoadCallback => onLoadCallback(cjsEvent));

            this.element = cjsEvent.source;
            
        }), "");

        html = _StringHTMLElementsUtil.injectAttribute(html, CjsObjectAttributePrefix, this._id!);

        return html;
    }

    private getConstructorClass<Args extends any[]>(): new (...args: Args) => this {
        return this.constructor as unknown as new (...args: Args) => this;
    }

    /**
     * 
     * / 🟢 ------------ PUBLIC SCOPE ------------ 🟢 /
     * 
     */

    public _addToPrototypeData(prototypeData: Partial<PrototypeData>) {
        const prototypes = (this.constructor as typeof CjsComponent)._prototypesData;

        if(prototypes.has(this.constructor)) {
            const obj = prototypes.get(this.constructor);

            prototypes.set(this.constructor, { ...obj, ...prototypeData } as PrototypeData);
            return;
        }

        prototypes.set(this.constructor, prototypeData as PrototypeData);
        
    }

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

    /** Provides auto fill height of the component to the actual screen height (with optional offsets) */
    public fillHeight(offset: number = 0, maxHeight: number | undefined = undefined) {
        this._addToPrototypeData({ fillHeightData: { offset, maxHeight } });
    }

    public getForms(): CjsForm[] | null {
        const element = this.element;

        if(!element) return null;

        return Array.from(
            element.querySelectorAll("form"), 
            (el) => new CjsForm(el)
        );
    }

    public getComponents(): CjsComponentsCollection {
        return new CjsComponentsCollection(document.body.querySelectorAll(`[${CjsObjectAttributePrefix}="${this._id}"]`));
    }

    /** Sets the data for the component */ 
    public withData(data: Partial<TData> | null = null): CjsComponent<TData> {
        if(data) this._preSetData = CjsObjectUtil.copy(data);
        return this;
    } 
    
    /** Sets additional style for the component */ 
    public withStyle(style: Partial<Record<keyof CSSStyleDeclaration, string>>): CjsComponent<TData> { 
        this._additionalStyle = CjsObjectUtil.copy(style);
        return this;
    }

    /** Example: render HTML string */
    public render(data: Partial<TData> | null = null) {
        return new (this.getConstructorClass())(data).getHtml();
    }

    /** Example: visualise component as element */
    public visualise(data: Partial<TData> | null = null) {
        if(data) this._preSetData = CjsObjectUtil.copy(data);

        return _DOMElementsUtil.HTMLToElement(this.getHtml());
    }

    /** Example: querySelector logic */
    public querySelector(selectors: string) {
        return this.getFirst()!.querySelector(selectors);
    }
    

    /** Get first occurrence of the CjsComponent as HTMLElement */
    public getFirst() {
        return document.body.querySelector<HTMLElement>(`[${CjsObjectAttributePrefix}="${this._id}"]`);
    }

    /** Get all occurrences of the CjsComponent as HTMLElement */
    public getAll() {
        return document.body.querySelectorAll<HTMLElement>(`[${CjsObjectAttributePrefix}="${this._id}"]`);
    }

    /** Loads CjsLayout inside CjsComponent */
    public loadLayout(layout: CjsLayout) {
        for(const el of this.getAll()) {
            el.innerHTML = '';
            for(const layoutEl of layout.visualise()) {
                el.appendChild(layoutEl);
            }
        }
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
        let id = this._prototypesData.get(this)!.id;

        if (!id) {
            id = new this()._id!;
        }
        
        return id;
    }

    static getInstance(
        this: { new (...args: any[]): any } & typeof CjsComponent,
        ...args: any[]
    ): InstanceType<typeof this> {
        const cls = this;
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
            element.querySelectorAll("form") as HTMLFormElement[], 
            (el) => new CjsForm(el)
        );
    }

    static getComponents<T extends CjsComponent<any>>(
        this: Constructor<T>
    ) {
        return (this as StaticCast<T>).getInstance().getComponents();
    }

    /** Sets the data for the component */ 
    static withData<T extends CjsComponent<any>>( 
        this: (new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T), 
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {} 
    ): T {
        return (this as StaticCast<T>).getInstance(data); 
    } 
    
    /** Sets additional style for the component */ 
    static withStyle<T extends CjsComponent<any>>(
         this: (new (preSetData: any, additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>) => T), 
         style: Partial<Record<keyof CSSStyleDeclaration, string>> 
    ): T { 
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
        return (this as StaticCast<T>).getInstance().visualise(data);
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

    /** Loads CjsLayout inside CjsComponent */
    static loadLayout<T extends CjsComponent<any>>(
        this: Constructor<T>,
        layout: CjsLayout
    ) {
        return (this as StaticCast<T>).getInstance().loadLayout(layout);
    }
}