

export const _DOMElementsUtil = {
    HTMLToElement(html: string): HTMLElement {
        const template = document.createElement("template");
        template.innerHTML = html.trim();

        const element = template.content.firstElementChild;

        if (!element) {
            throw new Error("htmlToElement: Provided HTML produced no element.");
        }

        return element as HTMLElement;
    },
}
