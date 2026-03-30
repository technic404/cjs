import { Constructor } from "../types";
import { CjsComponent } from "./CjsComponent";
import { _CjsLoggerUtil } from "../utils/protected/_CjsLoggerUtil";
import { CjsComponentReRenderTag, CjsObjectAttributePrefix } from "../constants";
import { _DOMElementsUtil } from "../utils/protected/_DOMElementsUtil";
import { CjsStringUtil } from "../utils/public/CjsStringUtil";

export type CjsLayoutNode = Constructor<CjsComponent> | CjsComponent | CjsLayout | (() => Promise<CjsLayoutNode>) | null | CjsLayoutNode[];

const CjsLayoutTakenIds: string[] = [];

export class CjsLayout<TData = any> {

    public _preSetData: TData | null = null;
    public _additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>> | null = null;

    public _layoutObjects: Element[] = [];

    public elements: (data: TData) => CjsLayoutNode[][];

    /**
     * @param elements Function returning layout structure
     */
    constructor(elements: (data: TData | null) => CjsLayoutNode[][]) {
        this.elements = elements;
    }

    public withData(preSetData: TData): CjsLayout {
        this._preSetData = preSetData;
        return this;
    }

    public withStyle(additionalStyle: Partial<Record<keyof CSSStyleDeclaration, string>>) {
        this._additionalStyle = additionalStyle;
        return this;
    }

    private createErrorElement() {
        return document.createElement("cjslayouterror");
    }


    /** Build DOM structure */
    public visualise(): HTMLElement[] {
        const tempWrapper = document.createElement("div");

        function isConstructable(v: any): boolean {
            return typeof v === "function" && v.prototype?.constructor === v;
        }

        function isAsyncFunction(v: any): boolean {
            return (v as any)[Symbol.toStringTag] === "AsyncFunction";
        }

        const getConstructedInstance = (instance: CjsComponent, elements: CjsLayoutNode[]) => {
            if(!(instance instanceof CjsComponent)) {
                _CjsLoggerUtil.error("The element should be CjsComponent, but passed", instance);

                return [this.createErrorElement()];
            }

            const component = instance.visualise();
            const hasParentAndChild = elements.length === 2;

            if (hasParentAndChild) {
                let renderPlaceholder = component.getElementsByTagName(CjsComponentReRenderTag)[0];

                const children = elements[1];

                if (!Array.isArray(children)) {
                    _CjsLoggerUtil.error("Layout sub components at second argument have to be Array");
                    
                    return [component];
                }

                children.forEach((child, index) => {
                    if (child === null) return;

                    const isLast = index === children.length - 1;
                    const childRoot = child[0];
                    const builtChild = walk(child);

                    if (childRoot instanceof CjsLayout) {
                        for(const _buildChild of builtChild) {
                            component.insertAdjacentElement("beforeend", _buildChild);
                        }
                        return;
                    }

                    renderPlaceholder = component.getElementsByTagName(CjsComponentReRenderTag)[0];

                    if (renderPlaceholder) {
                        if (!isLast) {
                            renderPlaceholder.insertAdjacentElement("afterend",
                                document.createElement(CjsComponentReRenderTag)
                            );
                        }
                        for(const _buildChild of builtChild) {
                            renderPlaceholder.insertAdjacentElement("afterend", _buildChild);
                        }

                        renderPlaceholder.remove();
                    } else {
                        for(const _buildChild of builtChild) {
                            component.insertAdjacentElement("beforeend", _buildChild);
                        }
                    }
                });
            }

            return [component];
        }

        const walk = (elements: CjsLayoutNode): HTMLElement[] => {
            if (!Array.isArray(elements)) {
                _CjsLoggerUtil.error("Layout have wrong pattern, component should be in array");

                return [this.createErrorElement()];
            }

            if (elements.length === 0) {
                _CjsLoggerUtil.error("Layout have an empty component space");

                return [this.createErrorElement()];
            }

            const element = elements[0];

            if (element instanceof CjsLayout) {
                return element.visualise();
            }

            if(isAsyncFunction(element)) {
                const asyncElement = document.createElement("cjsasyncelement");

                (element as (() => Promise<CjsLayoutNode>))().then(asyncElements => {
                    const children = walk([asyncElements]);

                    for(const child of children) {
                        asyncElement.insertAdjacentElement(`beforebegin`, child);
                    }

                    asyncElement.remove();
                })

                return [asyncElement];
            }

            const instance = 
                (isConstructable(element)
                ? new (element as Constructor<CjsComponent>)()
                : element) as CjsComponent;

            return getConstructedInstance(instance, elements);
        };

        this.elements(this._preSetData as TData).forEach(elements => {
            if (!elements) return;
            
            const processedElements = walk(elements.filter(e => e !== null));

            for(const processedElement of processedElements) {
                tempWrapper.insertAdjacentElement(
                    "beforeend",
                    processedElement
                );
            }
        });

        this._layoutObjects = Array.from(tempWrapper.children);

        if(this._additionalStyle) {
            for(const firstDeepObject of this._layoutObjects) {
                const additionalStyleParsed = Object.entries(this._additionalStyle).map(e => `${e[0]}: ${e[1]}`).join("; ") + ";";
                const existingStyle = firstDeepObject.hasAttribute("style") ? firstDeepObject.getAttribute("style") : null;

                if(!existingStyle) {
                    firstDeepObject.setAttribute("style", additionalStyleParsed);
                    continue;
                }

                const existingStyleHasClosing = existingStyle.endsWith(";");

                firstDeepObject.setAttribute("style", existingStyleHasClosing 
                    ? `${existingStyle} ${additionalStyleParsed}`
                    : `${existingStyle}; ${additionalStyleParsed}`
                );
            }

            this._additionalStyle = null;
        }

        return this._layoutObjects as HTMLElement[];
    }

    reRender() {
        const layoutElements = this._layoutObjects;
        const firstLayoutElementOccurrence = layoutElements[0];
        const otherLayoutElements = layoutElements.slice(1);

        console.log(this._layoutObjects, firstLayoutElementOccurrence);
        

        otherLayoutElements.forEach(el => el.remove());

        for(const child of this.visualise()) {
            firstLayoutElementOccurrence.insertAdjacentElement(`beforebegin`, child);
        }

        firstLayoutElementOccurrence.remove();
    }
}