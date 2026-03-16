import { Constructor } from "cjs/types";
import { CjsComponent } from "./CjsComponent";
import { _CjsLoggerUtil } from "cjs/utils/_CjsLoggerUtil";
import { CjsComponentReRenderTag } from "cjs/constants";

export type CjsLayoutNode = Constructor<CjsComponent> | CjsLayout | CjsLayoutNode[];

export class CjsLayout<TData = any> {

    public elements: (data: TData) => CjsLayoutNode[][];

    /**
     * @param elements Function returning layout structure
     */
    constructor(elements: (data: TData) => CjsLayoutNode[][]) {
        this.elements = elements;
    }


    /** Build DOM structure */
    public toElement(): HTMLElement {
        const tempWrapper = document.createElement("div");

        function isConstructable(v: any): boolean {
            return typeof v === "function" && v.prototype?.constructor === v;
        }

        const walk = (elements: CjsLayoutNode): HTMLElement => {
            if (!Array.isArray(elements)) {
                _CjsLoggerUtil.error("Layout have wrong pattern, component should be in array");

                return document.createElement("cjslayouterror");
            }

            if (elements.length === 0) {
                _CjsLoggerUtil.error("Layout have an empty component space");

                return document.createElement("cjslayouterror");
            }

            const element = elements[0];

            if (element instanceof CjsLayout) return element.toElement();

            if(!isConstructable(element)) {
                _CjsLoggerUtil.error("Passed element should be a constructable prototype");

                return document.createElement("cjslayouterror");
            }

            const instance = new (element as Constructor<CjsComponent>)();

            const component = instance.visualise();
            const hasParentAndChild = elements.length === 2;

            if (hasParentAndChild) {
                let renderPlaceholder = component.querySelector(CjsComponentReRenderTag);

                const children = elements[1];

                if (!Array.isArray(children)) {
                    _CjsLoggerUtil.error("Layout sub components at second argument have to be Array");
                    
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

                    renderPlaceholder = component.querySelector(CjsComponentReRenderTag);

                    if (renderPlaceholder) {
                        if (!isLast) {
                            renderPlaceholder.insertAdjacentElement("afterend",
                                document.createElement(CjsComponentReRenderTag)
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

            tempWrapper.insertAdjacentElement(
                "beforeend",
                walk(elements.filter(e => e !== null))
            );
        });

        return tempWrapper.innerHTML;
    }

}