export class CjsComponentsCollection {
    private components: HTMLElement[];

    constructor(components: NodeListOf<HTMLElement>) {
        this.components = Array.from(components);
    }

    private call(func: (el: HTMLElement) => void): void {
        this.components.forEach(c => func(c));
    }

    public _add(element: HTMLElement): void {
        this.components.push(element);
    }

    /**
     * Sets the class name for all components
     */
    set className(token: string) {
        this.call(c => c.className = token);
    }

    /**
     * Returns the value of first component className
     */
    get className(): string | null {
        if (this.components.length === 0) return null;
        return this.components[0].className;
    }

    /**
     * classList wrapper for all components
     */
    get classList() {
        return {
            add: (...tokens: string[]): void => {
                this.call(c => c.classList.add(...tokens));
            },

            remove: (...tokens: string[]): void => {
                this.call(c => c.classList.remove(...tokens));
            },

            contains: (token: string): boolean => {
                return this.components.every(c => c.classList.contains(token));
            },

            toggle: (token: string, force?: boolean): void => {
                this.call(c => c.classList.toggle(token, force));
            },

            addExcept: (token: string, except: HTMLElement): void => {
                this.call(c => {
                    if (c !== except) c.classList.add(token);
                });
            },

            removeExcept: (token: string, except: HTMLElement): void => {
                this.call(c => {
                    if (c !== except) c.classList.remove(token);
                });
            },

            addOnlyRemoveOthers: (token: string, only: HTMLElement): void => {
                this.call(c => {
                    c.classList[c === only ? "add" : "remove"](token);
                });
            },

            removeOnlyAddOthers: (token: string, only: HTMLElement): void => {
                this.call(c => {
                    c.classList[c === only ? "remove" : "add"](token);
                });
            }
        };
    }
}