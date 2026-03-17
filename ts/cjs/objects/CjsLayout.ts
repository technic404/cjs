import { Constructor } from "../types";
import { CjsComponent } from "./CjsComponent";
import { _CjsLoggerUtil } from "../utils/protected/_CjsLoggerUtil";
import { CjsComponentReRenderTag } from "../constants";
import { _DOMElementsUtil } from "../utils/protected/_DOMElementsUtil";

export type CjsLayoutNode = Constructor<CjsComponent> | CjsComponent | CjsLayout | CjsLayoutNode[];

export class CjsLayout<TData = any> {

    public _preSetData: TData | null = null;

    public elements: (data: TData) => CjsLayoutNode[][];

    /**
     * @param elements Function returning layout structure
     */
    constructor(elements: (data: TData | null) => CjsLayoutNode[][]) {
        this.elements = elements;
    }

    public withData(preSetData: TData): CjsLayout {
        const clone = Object.create(Object.getPrototypeOf(this));
        Object.assign(clone, this);

        clone._preSetData = preSetData;
        return clone;
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

            if (element instanceof CjsLayout) return element.visualise();

            const instance = 
                (isConstructable(element)
                ? new (element as Constructor<CjsComponent>)()
                : element) as CjsComponent

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

                        // renderPlaceholder.replaceWith(builtChild);
                        for(const _buildChild of builtChild) {
                            renderPlaceholder.insertAdjacentElement("afterend", _buildChild);
                        }

                        renderPlaceholder.remove();
                    } else {
                        for(const _buildChild of builtChild) {
                            component.insertAdjacentElement("beforeend", _buildChild);
                        }

                        // console.log(component, tempWrapper);
                        
                        // component.insertAdjacentElement("beforeend", builtChild);
                    }
                });
            }

            return [component];
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

        return Array.from(tempWrapper.children) as HTMLElement[];
    }
}