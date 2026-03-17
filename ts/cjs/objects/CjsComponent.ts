import { CjsEvent } from "../types";
import { _DOMElementsUtil } from "../utils/protected/_DOMElementsUtil";
import { _StringHTMLElementsUtil } from "../utils/protected/_StringHTMLElementsUtil";
import { CjsObjectUtil } from "../utils/public/CjsObjectUtil";

type EventsMap = Record<string, (e: object) => any>;

export class CjsComponent<TData = any> {
    public __events: EventsMap = {};

    private fillHeightData?: { offset: number; maxHeight?: number };

    public _cssStyle: string | null = null;
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

    private getHtml() {
        let html = this._template();

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

    public visualise(preSetData: Partial<TData> | null = null) {
        if(preSetData) this._preSetData = CjsObjectUtil.copy(preSetData);
        
        return _DOMElementsUtil.HTMLToElement(this.getHtml());
    }
    
    /**
     * 
     * / 🔵 ------------ GETTERS SCOPE ------------ 🔵 /
     * 
     */
    

    get data(): TData {
        return CjsObjectUtil.copy(
            CjsObjectUtil.join(this._defaultData, this._preSetData)
        ) as TData;
    }
    
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

    static render<T extends CjsComponent<any>>(
        this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T,
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return new this(data).getHtml();
    }

    static visualise<T extends CjsComponent<any>>(
        this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T,
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return _DOMElementsUtil.HTMLToElement(new this(data).getHtml());
    }

    static withData<T extends CjsComponent<any>>(
        this: new (preSetData: Partial<T extends CjsComponent<infer D> ? D : never>) => T, 
        data: Partial<T extends CjsComponent<infer D> ? D : never> = {}
    ) {
        return new this(data);
    }

    static withStyle<T extends CjsComponent<any>>(
        this: new (preSetData: any, additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>) => T,
        style: Partial<Record<keyof CSSStyleDeclaration, string>>
    ) {
        return new this(null, style);
    }
}