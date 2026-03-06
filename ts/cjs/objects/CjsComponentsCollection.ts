export class CjsComponentsCollection {

    public components: HTMLElement[];

    constructor(components: NodeListOf<HTMLElement> | HTMLElement[]) {
        this.components = Array.from(components);
    }

    private call(fn: (el: HTMLElement) => void): void {
        this.components.forEach(fn);
    }

    public add(element: HTMLElement): void {
        this.components.push(element);
    }

    public set className(token: string) {
        this.call(el => {
            el.className = token;
        });
    }

    public get className(): string | null {
        if (this.components.length === 0) return null;

        return this.components[0].className;
    }

    public get classList() {
        return {
            add: (...tokens: string[]) =>
                this.call(el => el.classList.add(...tokens)),
            remove: (...tokens: string[]) =>
                this.call(el => el.classList.remove(...tokens)),
            contains: (token: string): boolean => {

                return this.components.every(el =>
                    el.classList.contains(token)
                );
            },
            toggle: (token: string, force?: boolean) =>
                this.call(el => el.classList.toggle(token, force)),
            addExcept: (token: string, except: HTMLElement) =>
                this.call(el => {
                    if (el !== except)
                        el.classList.add(token);
                }),
            removeExcept: (token: string, except: HTMLElement) =>
                this.call(el => {
                    if (el !== except)
                        el.classList.remove(token);
                }),
            addOnlyRemoveOthers: (token: string, only: HTMLElement) =>
                this.call(el => {
                    el.classList[el === only ? "add" : "remove"](token);
                }),
            removeOnlyAddOthers: (token: string, only: HTMLElement) =>
                this.call(el => {
                    el.classList[el === only ? "remove" : "add"](token);
                })
        };
    }
}