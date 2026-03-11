import { CJS_COMPONENT_FORCE_RENDER_PLACE_TAG, CJS_LAYOUT_PREFIX, CJS_PRETTY_PREFIX_X, CJS_ROOT_CONTAINER_PREFIX, CjsFrameworkEvents, CjsTakenAttributes } from "../Constants";
import { AttributeHelper } from "../helpers/AttributeHelper";
import { CjsLayoutNode, Constructor } from "../types";
import { CjsComponent } from "./CjsComponent";

export class CjsLayout {
    private onLoadCallback: (data: object) => void = () => {};

    private dataState: {
        default: object | null | undefined;
        active: object | null;
    } = {
        default: undefined,
        active: null
    };

    /** attribute identifier of layout */
    public attribute: string;

    public elements: (layoutData: object | null) => CjsLayoutNode[][];

    /**
     * @param elements Function returning layout structure
     */
    constructor(elements: (layoutData: object | null) => CjsLayoutNode[][]) {
        this.elements = elements;
        this.attribute = AttributeHelper.generateAttribute(
            CJS_LAYOUT_PREFIX,
            CjsTakenAttributes.layouts
        );
    }

    /**
     * Set function that will be executed when layout is loaded on website
     */
    public onLoad(callback: (layoutData: object) => void): void {
        this.onLoadCallback = (data: object) => {
            CjsFrameworkEvents.onLoadLayout(this);
            callback(data);
        };
    }

    /**
     * Executes the onLoad function and sub components/layouts onLoad
     */
    public _executeOnLoad(data: object): void {
        this.elements(this.dataState.active).flat().forEach(element => {
            if (element instanceof CjsLayout) {
                element._executeOnLoad(this.dataState.active as object);
            }
        });

        this.onLoadCallback(data);
    }

    /**
     * Finds component in layout
     */
    public select(component: CjsComponent): CjsComponent | null {
        const filtered = this.elements(this.dataState.active)
            .flat()
            .filter(e => (e as CjsComponent).attribute === component.attribute);

        if (filtered.length === 0) {
            console.log(`${CJS_PRETTY_PREFIX_X}Component not found when trying to use select(), make sure that provided component exists in layout`);
            return null;
        }

        return filtered[0] as CjsComponent;
    }

    /** Provides active layout data */
    public get data(): object | null {
        return this.dataState.active;
    }

    /**
     * Reset layout data to default
     */
    public resetToDefaultData(): this {
        if (this.dataState.default === undefined) {
            console.log(`${CJS_PRETTY_PREFIX_X}Cannot reset layout data to default, because default data is not set`);
            return this;
        }

        this.dataState.active = Object.assign({}, this.dataState.default);
        return this;
    }

    /**
     * Sets global layout data
     */
    public setData(data: object | null): this {
        if (data === null) {
            this.dataState.active = null;
            return this;
        }

        if (this.dataState.default !== undefined) {
            const overwriteNotSetValues = (
                existing: any,
                provided: any
            ): any => {
                const deepObjectCopy = (obj: any): any => {
                    if (obj === null || typeof obj !== "object") return obj;

                    if (obj.constructor && obj.constructor !== Object) {
                        return new (obj.constructor as any)();
                    }

                    if (Array.isArray(obj)) {
                        return obj.map(item => deepObjectCopy(item));
                    }

                    const newObj: any = {};

                    for (const key in obj) {
                        if (!Object.prototype.hasOwnProperty.call(obj, key))
                            continue;
                        newObj[key] = deepObjectCopy(obj[key]);
                    }

                    return newObj;
                };

                const merged = deepObjectCopy(existing);

                const walk = (obj1: any, obj2: any) => {
                    for (const key in obj2) {
                        if (!Object.prototype.hasOwnProperty.call(obj2, key))
                            continue;

                        if (
                            typeof obj2[key] === "object" &&
                            obj2[key] !== null &&
                            obj1[key]
                        ) {
                            walk(obj1[key], obj2[key]);
                        } else {
                            obj1[key] = obj2[key];
                        }
                    }
                };

                walk(merged, provided);
                return merged;
            };

            this.dataState.active = overwriteNotSetValues(
                this.dataState.default,
                data
            );
        } else {
            this.dataState.default = {};
            this.dataState.active = {};
        }

        this.dataState.default = Object.assign({}, data);
        this.dataState.active = Object.assign({}, this.dataState.default);

        return this;
    }

    /**
     * Converts layout into component with data
     */
    public asComponentWithData(data: object): CjsComponent {
        this.setData(data);

        const component = new CjsComponent();

        component._template = () => `<div></div>`;
        component.onLoad(() => component.loadLayout(this.setData(data)));

        return component;
    }

    /** Replace page content with layout */
    public replacePage(): void {
        const container = document.getElementById(CJS_ROOT_CONTAINER_PREFIX);

        if (!container) return;

        container.innerHTML = "";
        container.appendChild(this.toElement());

        this._executeOnLoad(this.dataState.active as object);
    }

    /** Get layout element from DOM */
    public getElement(): HTMLElement | null {
        return document.body.querySelector(`[${this.attribute}]`);
    }

    /** Check if layout exists in DOM */
    public exists(): boolean {
        return this.getElement() !== null;
    }

    /** Build DOM structure */
    public toElement(): HTMLElement {
        const container = document.createElement("div");
        container.setAttribute(this.attribute, "");

        function isConstructable(v: any): boolean {
            return typeof v === "function" && v.prototype?.constructor === v;
        }

        const walk = (elements: CjsLayoutNode): HTMLElement => {
            if (!Array.isArray(elements)) {
                console.log(`${CJS_PRETTY_PREFIX_X}Layout have wrong pattern, component should be in array`);

                return document.createElement("cjslayouterror");
            }

            if (elements.length === 0) {
                console.log(`${CJS_PRETTY_PREFIX_X}Layout have an empty component space`);

                return document.createElement("cjslayouterror");
            }

            const layoutElement = elements[0];

            if (layoutElement instanceof CjsLayout) {
                return layoutElement.toElement();
            }

            if (!(layoutElement instanceof CjsComponent)) {
                console.log(`${CJS_PRETTY_PREFIX_X}The passed element inside layout is not CjsComponent or CjsLayout`);

                return document.createElement("cjslayouterror");
            }

            const component = layoutElement instanceof CjsComponent
                 ? layoutElement.toVirtualElement() 
                 : new (layoutElement as unknown as Constructor<CjsComponent>)().toVirtualElement();
            const hasParentAndChild = elements.length === 2;

            if (hasParentAndChild) {
                let renderPlaceholder = component.querySelector(CJS_COMPONENT_FORCE_RENDER_PLACE_TAG);

                const children = elements[1];

                if (!Array.isArray(children)) {
                    console.log(`${CJS_PRETTY_PREFIX_X}Layout sub components at second argument have to be Array`);
                    return component;
                }

                children.forEach((child, index) => {
                    if (child === null) return;

                    const isLast = index === children.length - 1;
                    const childRoot = child[0];
                    const builtChild = walk(child);

                    if (childRoot instanceof CjsLayout) {
                        component.insertAdjacentElement("beforeend", builtChild);
                        return;
                    }

                    renderPlaceholder = component.querySelector(CJS_COMPONENT_FORCE_RENDER_PLACE_TAG);

                    if (renderPlaceholder) {
                        if (!isLast) {
                            renderPlaceholder.insertAdjacentElement("afterend",
                                document.createElement(
                                    CJS_COMPONENT_FORCE_RENDER_PLACE_TAG
                                )
                            );
                        }

                        renderPlaceholder.replaceWith(builtChild);
                    } else {
                        component.insertAdjacentElement("beforeend", builtChild);
                    }
                });
            }

            return component;
        };

        this.elements(this.dataState.active).forEach(elements => {
            if (!elements) return;

            container.insertAdjacentElement(
                "beforeend",
                walk(elements.filter(e => e !== null))
            );
        });

        return container;
    }

    /** Hide layout */
    public hide(): void {
        const el = this.getElement();
        if (el) el.style.display = "none";
    }

    /** Show layout */
    public show(): void {
        const el = this.getElement();
        if (el) el.style.display = "";
    }

    /** Rerender all layouts */
    public rerenderLayouts(): this {
        const layouts = Array.from(document.body.querySelectorAll(`[${this.attribute}]`));
        const newLayout = this.toElement();

        for (const layout of layouts) {
            layout.replaceWith(newLayout);

            setTimeout(() => {
                this._executeOnLoad(this.dataState.active as object);
                CjsFrameworkEvents.onLoadLayout(this);
            }, 2);
        }

        return this;
    }
}