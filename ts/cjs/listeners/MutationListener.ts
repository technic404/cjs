import { CJS_ELEMENT_PREFIX, CJS_ID_LENGTH, CJS_OBSERVER_PREFIX, CJS_PRETTY_PREFIX_X } from "../Constants";
import { functionMappings } from "../FunctionMappings";
import { CjsEvent } from "../objects/CjsEvent";
import { cjsRunnable, CjsRunnableDetails } from "../Runnable";
import { getAttributeStartingWith } from "../utils/ElementUtil";
import { getRandomCharacters } from "../utils/StringUtil";
import { CjsRunnableStyleWatcher } from "../utils/StyleUtil";

export class CjsMutationEvent {
    public target: HTMLElement;
    public date: Date;

    constructor(target: HTMLElement, date: Date) {
        this.target = target;
        this.date = date;
    }
}

export class CjsMutationListener {
    private onAddCallback: (element: Element) => void = () => {};

    private map = new Map<
        string,
        {
            type: "add" | "remove";
            action: (event: CjsEvent) => void;
            data: Record<string, any>;
        }
    >();

    private executedFunctions = new Map<
        string,
        { elements: Element[] }
    >();

    private observer: MutationObserver;

    constructor() {
        this.observer = new MutationObserver(this.callback);
    }

    private processForms(): void {
        document.body.querySelectorAll("form").forEach(form => {
            form.onsubmit = e => e.preventDefault();
        });
    }

    private findRealElements(attribute: string): HTMLElement[] {
        return Array.from(document.querySelectorAll<HTMLElement>(`[${attribute}='']`))
            .flat();
    }

    private callback = (mutationsList: MutationRecord[]) => {
        this.processForms();

        const childListMutations = mutationsList.filter(m => m.type === "childList");
        const addedNodes = childListMutations
            .map(m => Array.from(m.addedNodes))
            .flat()
            .filter(node => node.nodeType === 1)
            .map(node => {
                const wrapper = document.createElement("div");
                wrapper.appendChild(node.cloneNode(true));
                return wrapper;
            })
            .map(el => Array.from(el.querySelectorAll("*")))
            .flat() as HTMLElement[];

        for (const fictionChild of addedNodes) {
            this.onAddCallback(fictionChild);

            const elements = {
                element: getAttributeStartingWith(fictionChild, CJS_ELEMENT_PREFIX)
                    .map(attribute => ({
                        elements: this.findRealElements(attribute),
                        attribute
                    }))
                    .flat(),

                observer: getAttributeStartingWith(fictionChild, CJS_OBSERVER_PREFIX)
                    .map(attribute => ({
                        elements: this.findRealElements(attribute),
                        attribute
                    }))
                    .flat()
            };

            // Style handling
            if (cjsRunnable.isStyleValid()) {
                const attributes = Array.from(fictionChild.attributes).filter(
                    attr => CjsRunnableStyleWatcher.has(attr.name)
                );

                for (const attribute of attributes) {
                    const watcher = CjsRunnableStyleWatcher.get(attribute.name);

                    if (!watcher) continue;

                    const runnableDetails = CjsRunnableDetails.style.map.get(watcher.path);

                    if (!CjsRunnableDetails.style.map.has(watcher.path)) {
                        console.log(`${CJS_PRETTY_PREFIX_X}Could not find ${watcher.path}`);
                        return;
                    }

                    this.findRealElements(attribute.name).forEach(el => {
                        el.setAttribute(runnableDetails.prefix, "");
                    });
                }
            }

            elements.element.forEach(({ elements, attribute }) => {
                elements.forEach(element => {
                    functionMappings.applyElementAttributeMappingFunction(
                        element,
                        attribute,
                        true
                    );
                });
            });

            elements.observer.forEach(({ elements, attribute }) => {
                elements.forEach(element => {
                    this.execute("add", attribute, element);
                });
            });
        }

        // Handle removed nodes
        for (const removed of childListMutations
            .map(m => Array.from(m.removedNodes))
            .flat()
        ) {
            const attributes = getAttributeStartingWith(removed as Element, CJS_OBSERVER_PREFIX);

            attributes.forEach(attribute => {
                this.execute("remove", attribute, removed);
            });
        }
    };

    public observe(): void {
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    public onAdd(callback: (element: Element) => void): void {
        this.onAddCallback = callback;
    }

    public listen(type: "add" | "remove", fn: (event: CjsEvent) => void): string | null {
        if (type !== "add" && type !== "remove") {
            console.log(`${CJS_PRETTY_PREFIX_X}Type must be 'add' or 'remove'`);

            return null;
        }

        let attribute: string | null = null;

        while (!attribute || this.map.has(attribute)) {
            attribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        this.map.set(attribute, {
            type,
            action: fn,
            data: {}
        });

        return ` ${attribute} `;
    }

    public cloneAttribute(attribute: string): string | null {
        if (!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Attribute does not exist`);

            return null;
        }

        let newAttribute: string | null = null;

        while (!newAttribute || this.map.has(newAttribute)) {
            newAttribute = `${CJS_OBSERVER_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        const cloned = Object.assign({}, this.map.get(attribute));

        this.map.set(newAttribute, cloned);

        return newAttribute;
    }

    public replaceAttribute(
        element: HTMLElement,
        oldAttribute: string,
        newAttribute: string
    ): void {
        element.removeAttribute(oldAttribute);
        element.setAttribute(newAttribute, "");
    }

    public setData(attribute: string, data: object): string | null {
        if (!this.map.has(attribute)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Attribute does not exist`);

            return null;
        }

        const newAttribute = this.cloneAttribute(attribute);

        if (!newAttribute) return null;

        const obj = this.map.get(newAttribute);

        if (obj) obj.data = data;

        return newAttribute;
    }

    public executeAll(type: "add" | "remove"): void {
        for (const [attribute, data] of CjsRunnableStyleWatcher.entries()) {
            const elements = document.body.querySelectorAll(`[${attribute}='']`);

            if (!elements.length) continue;

            elements.forEach(element => {
                const parsedPath = data.path;
                const attribute = CjsRunnableDetails.style.map.get(parsedPath);

                if (attribute) {
                    element.setAttribute(attribute.prefix, "");
                }
            });
        }

        for (const [attribute, obj] of this.map.entries()) {
            if (obj.type !== type) continue;

            const elements = document.body.querySelectorAll(`[${attribute}='']`);

            if (!elements.length) continue;

            elements.forEach(element => {
                this.execute(type, attribute, element);
            });
        }
    }

    public execute(type: "add" | "remove", attribute: string, element: Node): void {
        if (!this.map.has(attribute)) return;

        const registered = this.executedFunctions.get(attribute);

        if (registered?.elements.includes(element as Element)) return;

        const obj = this.map.get(attribute);

        if (!obj || obj.type !== type) return;

        const cjsEvent = new CjsEvent(
            new CjsMutationEvent(element as HTMLElement, new Date()),
            element as HTMLElement
        );

        obj.action(cjsEvent);

        if (!this.executedFunctions.has(attribute)) {
            this.executedFunctions.set(attribute, { elements: [] });
        }

        this.executedFunctions
            .get(attribute)!
            .elements.push(element as Element);
    }
}