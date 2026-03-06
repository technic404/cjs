import { CJS_COMPONENT_PREFIX, CJS_ID_LENGTH, CJS_PRETTY_PREFIX_X, CjsFrameworkEvents, CjsLazyClassPrefix, CjsLazyElementPrefix, CjsTakenAttributes } from "../Constants";
import { getAttributeStartingWith, htmlToElement } from "../utils/ElementUtil";
import { CjsObject } from "../utils/shared/CjsObjectUtil";
import { getRandomCharacters } from "../utils/StringUtil";
import { CjsLayout } from "./CjsLayout";

export class CjsComponent<TData = any> {
    public data: Partial<TData> = {} as Partial<TData>;
    public _renderData: TData = {} as TData
    public attribute: string;
    public _cssStyle: string | null = null;
    public _setStyle: CjsStyleProperties | null = null;

    private renderedCssStyle = false;
    private onLoadCallback: () => void = () => {};
    private fillHeightData?: { offset: number; maxHeight?: number };

    public preSetData: Partial<TData> = {};

    /**
     * Function that renders html.
     */
    public _: (find: () => HTMLElement | null, layoutData: object) => string = () => "";

    constructor() {
        this.attribute = Cjs.generateAttribute(
            CJS_COMPONENT_PREFIX,
            CjsTakenAttributes.components
        );
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
        this.mergeObjects(merged, this.data);

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
        const element = htmlToElement(html);

        if (!element.firstElementChild) return "";

        const root = element.firstElementChild as HTMLElement;

        attributes.forEach(attr => root.setAttribute(attr, ""));

        return root.outerHTML;
    }

    private addLazyIdentifiers(html: string): string {
        const container = htmlToElement(html);

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

    private getHtml(data: any, style: CjsStyleProperties | null): string {
        if (!this.renderedCssStyle && this._cssStyle) {
            addRootStyle(this.attribute, this._cssStyle, {
                prefixStyleRules: true,
                encodeKeyframes: true,
                enableMultiSelector: true
            });

            this.renderedCssStyle = true;
        }

        const renderFn = this._;
        const isAsync =
            (renderFn as any)[Symbol.toStringTag] === "AsyncFunction";

        const styleString =
            style &&
            Object.entries(style)
                .map(
                    ([key, value]) =>
                        `${this.camelToKebab(key)}: ${value};`
                )
                .join(" ");

        const html = isAsync
            ? `<div ${this.attribute}></div>`
            : renderFn.call(this, () => document.querySelector(`[${this.attribute}]`), {});

        const processed = style
            ? this.injectStyle(html, styleString!)
            : html;

        return this.addAttributes(
            this.addLazyIdentifiers(processed),
            [this.attribute]
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

    public setDefaultData(data: Partial<TData>): this {
        if (!(data instanceof Object)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Data passed into setDefaultData() must be object`);

            return this;
        }

        this.data = data;
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