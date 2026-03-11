import { CJS_COMPONENT_PREFIX, CJS_ELEMENT_ACTION_FILL_PREFIX, CJS_ID_LENGTH, CJS_PRETTY_PREFIX_X, CjsFrameworkEvents, CjsLazyClassPrefix, CjsLazyElementPrefix, CjsTakenAttributes } from "../Constants";
import { AttributeHelper } from "../helpers/AttributeHelper";
import { mutationListener } from "../listeners/Listeners";
import { createVirtualContainer, getAttributeStartingWith, htmlToElement } from "../utils/ElementUtil";
import { CjsObject } from "../utils/shared/CjsObjectUtil";
import { getRandomCharacters } from "../utils/StringUtil";
import { addRootStyle } from "../utils/StyleUtil";
import { CjsEvent } from "./CjsEvent";
import { CjsLayout } from "./CjsLayout";

export class CjsComponent<TData = any> {
    public data: TData = {} as TData;
    public _defaultData: Partial<TData> = {} as Partial<TData>;
    public attribute: string;
    public _cssStyle: string | null = null;
    public _setStyle: Partial<CSSStyleDeclaration> = {};
    public __actions: Record<string, unknown> = {};

    private renderedCssStyle = false;
    private onLoadCallback: () => void = () => {};
    private fillHeightData?: { offset: number; maxHeight?: number };

    public preSetData: Partial<TData> = {};

    /** Function that provides template for base html structure */
    public _template(): string {
        return "";
    }

    /** Function that provides actions for the component */
    public _actions(): Record<string, (event: CjsEvent) => void> {
        return {};
    }

    constructor() {
        this.attribute = AttributeHelper.generateAttribute(
            CJS_COMPONENT_PREFIX,
            CjsTakenAttributes.components
        );
    }

    get actions() : Record<string, unknown> {
        return new Proxy(this.__actions, {
            get(target, prop: string) {
                if (prop in target) {
                    return target[prop];
                }
                return `${CJS_ELEMENT_ACTION_FILL_PREFIX}${prop}`;
            }
        }) as Record<string, unknown>;
    }

    public wrapActions(actions: Record<string, (event: CjsEvent) => void>) {
        return actions;
    }

    private mergeObjects(target: any, source: any) {
        for (const key in source) {
            if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

            const isObject =
                typeof source[key] === "object" &&
                source[key] !== null &&
                target[key];

            if (isObject) {
                this.mergeObjects(target[key], source[key]);
            } else if (target[key] === null || target[key] === undefined) {
                target[key] = source[key];
            }
        }
    }

    private getData(data: Partial<TData>): TData {
        const merged: any = {};

        this.mergeObjects(merged, data);
        this.mergeObjects(merged, this._defaultData);

        return CjsObject.copy(merged);
    }

    private camelToKebab(str: string): string {
        return str
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
            .toLowerCase();
    }

    private injectStyle(html: string, styleValue: string): string {
        const len = html.length;
        let i = 0;

        while (i < len && html.charCodeAt(i) <= 32) i++;

        if (html[i] !== "<") return html;

        const tagStart = i;
        const tagEnd = html.indexOf(">", tagStart);

        if (tagEnd === -1) return html;

        const openingTag = html.slice(tagStart, tagEnd);
        const styleIndex = openingTag.indexOf("style=");

        let newOpeningTag: string;

        if (styleIndex !== -1) {
            const quote = openingTag[styleIndex + 6];
            const start = styleIndex + 7;
            const end = openingTag.indexOf(quote, start);
            const existing = openingTag.slice(start, end).trim();
            const merged =
                !existing.endsWith(";") && existing.length > 0
                    ? existing + ";" + styleValue
                    : existing + styleValue;

            newOpeningTag =
                openingTag.slice(0, start) +
                merged +
                openingTag.slice(end);
        } else {
            newOpeningTag = openingTag + ` style="${styleValue}"`;
        }

        return html.slice(0, tagStart) + newOpeningTag + html.slice(tagEnd);
    }

    private addAttributes(html: string, attributes: string[]): string {
        const element = createVirtualContainer(htmlToElement(html));

        if (!element.firstElementChild) return "";

        const root = element.firstElementChild as HTMLElement;

        attributes.forEach(attr => root.setAttribute(attr, ""));

        return root.outerHTML;
    }

    private addLazyIdentifiers(html: string): string {
        const container = createVirtualContainer(htmlToElement(html));

        const elements = Array.from(container.querySelectorAll(`[class*='${CjsLazyClassPrefix}']`))
            .filter(e => getAttributeStartingWith(e, CjsLazyElementPrefix).length === 0) as HTMLElement[];

        for (const element of elements) {
            let id: string | null = null;

            while (!id || CjsTakenAttributes.lazy.includes(id)) {
                id = getRandomCharacters(CJS_ID_LENGTH);
            }

            CjsTakenAttributes.lazy.push(id);

            element.setAttribute(`${CjsLazyElementPrefix}${id}`, "");
        }

        return container.innerHTML;
    }

    private getHtml(data: any, style: Partial<CSSStyleDeclaration> = {}): string {
        if (!this.renderedCssStyle && this._cssStyle) {
            addRootStyle(this.attribute, this._cssStyle, {
                prefixStyleRules: true,
                encodeKeyframes: true,
                enableMultiSelector: true
            });

            this.renderedCssStyle = true;
        }

        this.data = data;

        const renderFn = this._template;
        
        const isAsync = (renderFn as any)[Symbol.toStringTag] === "AsyncFunction";
        const styleString = Object.entries(style)
                .map(
                    ([key, value]) =>
                        `${this.camelToKebab(key)}: ${value};`
                )
                .join(" ");
        const onLoadAttribute = mutationListener.listen("add", async (cjsEvent) => {
            if(isAsync) {
                const html = await renderFn.call(this);

                cjsEvent.source.outerHTML = this.addAttributes(
                    this.addLazyIdentifiers(style ? this.injectStyle(html, styleString) : html),
                    [this.attribute]
                );
            }
            this.executeOnLoad();
        }) as string;

        if(isAsync) return `<div ${this.attribute} ${onLoadAttribute.trim()}></div>`;

        const html = renderFn.call(this);

        const processed = !CjsObject.isEmpty(style)
            ? this.injectStyle(html, styleString!)
            : html;

        return this.addAttributes(
            this.addLazyIdentifiers(processed),
            [this.attribute, onLoadAttribute.trim()]
        );
    }

    public setData(data: Partial<TData>): this {
        if (!(data instanceof Object)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Data passed into setData() must be object`);

            return this;
        }

        this.preSetData = data;

        const existing = document.body.querySelector(`[${this.attribute}=""]`);

        if (existing) {
            existing.replaceWith(
                htmlToElement(this.getHtml(this.getData(data), this._setStyle))
            );
        }

        return this;
    }

    public render(data: Partial<TData> = {}): string {
        return this.getHtml(this.getData(data), this._setStyle);
    }

    public visualise(data: Partial<TData> = {}): HTMLElement {
        return htmlToElement(this.render(data));
    }

    /**
     * Clones an component and sets data with argument (used for Layouts)
     */
    public withData(data: Partial<TData> = {}) {
        const clone = Object.create(Object.getPrototypeOf(this)) as this;
        Object.assign(clone, this);
        clone.attribute = AttributeHelper.generateAttribute(CJS_COMPONENT_PREFIX, CjsTakenAttributes.components);
        return clone.setData(data);
    }

    /**
     * Adds style to element using attribute `style="..."`
     */
    public withStyle(style: Partial<Record<keyof CSSStyleDeclaration, string>>) {
        const clone = Object.create(Object.getPrototypeOf(this));
        Object.assign(clone, this);
        clone.attribute = AttributeHelper.generateAttribute(CJS_COMPONENT_PREFIX, CjsTakenAttributes.components)
        clone._setStyle = style;
        return clone;
    }

    public toVirtualElement(): HTMLElement {
        return htmlToElement(
            this.getHtml(
                this.getData(this.preSetData),
                this._setStyle
            )
        );
    }

    public toElement(ignoreReadyState = false): HTMLElement | null {
        const existing = document.body.querySelector(`[${this.attribute}=""]`) as HTMLElement | null;

        if (existing) return existing;

        if (document.readyState === "complete" && !ignoreReadyState) {
            return existing;
        }

        return this.toVirtualElement();
    }

    public loadLayout(...layouts: CjsLayout[]): void {
        const element = this.toElement();
        if (!element) return;

        element.innerHTML = "";

        for (const layout of layouts) {
            element.appendChild(layout.toElement());

            setTimeout(() => {
                layout._executeOnLoad({});
                CjsFrameworkEvents.onLoadLayout(layout);
            }, 2);
        }
    }

    public onLoad(callback: () => void): void {
        this.onLoadCallback = callback;
    }

    private executeOnLoad(): void {
        this.onLoadCallback();

        if (this.fillHeightData) {
            const { offset, maxHeight } = this.fillHeightData;
            const element = this.toElement();
            
            if (!element) return;

            const resize = () => {
                const height =
                    maxHeight && window.innerHeight > maxHeight
                        ? maxHeight
                        : window.innerHeight + offset;

                element.style.height = `${height}px`;
            };

            resize();
            window.addEventListener("resize", resize);
        }
    }

    public hide(): void {
        const el = this.toElement();
        if (el) el.style.display = "none";
    }

    public show(): void {
        const el = this.toElement();
        if (el) el.style.display = "";
    }

    public exists(): boolean {
        return document.body.querySelector(`[${this.attribute}=""]`) !== null;
    }

    public setDefaultData(defaultData: Partial<TData>): this {
        if (!(defaultData instanceof Object)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Data passed into setDefaultData() must be object`);

            return this;
        }

        this._defaultData = defaultData;
        return this;
    }

    public querySelector<T extends HTMLElement = HTMLElement>(...selectors: string[]): (T | null) | (Array<T | null>) {
        const root = this.toElement();

        if (!root) return null;

        const results = selectors.map(sel => root.querySelector<T>(sel));

        return results.length > 1 ? results : results[0];
    }

    public querySelectorAll(selector: string): HTMLElement[] {
        const root = this.toElement();
        
        if (!root) return [];
        
        return Array.from(root.querySelectorAll(selector));
    }
}