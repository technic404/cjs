

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
    getAttributesStartingWith(element: Element, startingWith: string): string[] {
        if (!element.attributes) return [];

        const attributes: string[] = [];

        for (const attribute of Array.from(element.attributes)) {
            const attributeName = attribute.name;

            if (attributeName.startsWith(startingWith)) {
                attributes.push(attributeName);
            }
        }

        return attributes;
    }
}
