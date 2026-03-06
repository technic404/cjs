/**
 * Provides attributes that start with a certain string in an element
 */
export function getAttributeStartingWith(
    element: Element,
    startingWith: string
): string[] {
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


/**
 * Turns HTML string into HTMLElement
 */
export function htmlToElement(html: string): HTMLElement {
    const template = document.createElement("template");
    template.innerHTML = html.trim();

    const element = template.content.firstElementChild;

    if (!element) {
        throw new Error("htmlToElement: Provided HTML produced no element.");
    }

    return element as HTMLElement;
}


/**
 * Creates a <virtualContainer> wrapper around an element
 */
export function createVirtualContainer(element: HTMLElement): HTMLElement {
    const virtualContainer = document.createElement("virtualContainer");

    virtualContainer.appendChild(element);

    return virtualContainer;
}


/**
 * Finds parent that has attribute starting with passed value
 */
export function findParentThatHasAttribute(
    countFromElement: HTMLElement,
    attribute: string,
    includeSelf = true
): HTMLElement | null {
    const hasAttribute = (element: HTMLElement): boolean =>
        getAttributeStartingWith(element, attribute).length > 0;

    if (includeSelf && hasAttribute(countFromElement)) {
        return countFromElement;
    }

    let parent: HTMLElement | null = countFromElement.parentElement;

    while (parent) {

        if (hasAttribute(parent)) {
            return parent;
        }

        parent = parent.parentElement;
    }

    return null;
}