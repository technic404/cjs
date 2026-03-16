import { _DOMElementsUtil } from "cjs/utils/_DOMElementsUtil";
import { _StringHTMLElementsUtil } from "cjs/utils/_StringHTMLElementsUtil";
import { CjsObjectUtil } from "cjs/utils/CjsObjectUtil";

type ActionsMap = Record<string, (e: object) => any>;

export class CjsComponent<TData = any> {
    public __actions: ActionsMap = {};

    private fillHeightData?: { offset: number; maxHeight?: number };

    public _cssStyle: string | null = null;
    public _additionalStyle: Partial<CSSStyleDeclaration> = {};

    public _defaultData: Partial<TData> = {} as Partial<TData>;
    public _preSetData: Partial<TData> = {};

    /**
     * / ⚪ ------------ CONSTRUCTOR SCOPE ------------ ⚪ /
     */

    constructor(
        preSetData: Partial<TData> | null = null, 
        additionalStyle: Partial<CSSStyleDeclaration> | null = null
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
                Object.values(this._additionalStyle).join("; ")
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
    public _actions(): ActionsMap {
        return {} as ActionsMap;
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
            CjsObjectUtil.join(this._preSetData, this._defaultData)
        ) as TData
    }
    
    get actions() : ReturnType<this["_actions"]> {
        return new Proxy(this.__actions, {
            get(target, prop: string) {
                if (prop in target) {
                    return target[prop];
                }
                return `${prop}`;
            }
        }) as ReturnType<this["_actions"]>;
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