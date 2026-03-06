import { htmlToElement } from "../utils/ElementUtil";

/**
 * Wrapper around raw HTML string
 * Converts string → HTMLElement
 */
export class CjsHtmlElement {

    private readonly element: HTMLElement;

    /**
     * @param html Raw HTML string
     */
    constructor(html: string) {
        const parsed = htmlToElement(html);

        if (!parsed) {
            throw new Error("Invalid HTML provided to CjsHtmlElement");
        }

        this.element = parsed;
    }

    /**
     * Returns raw HTML string
     */
    public toString(): string {
        return this.element.outerHTML;
    }

    /**
     * Alias for toString()
     */
    public toHtml(): string {
        return this.toString();
    }

    /**
     * Returns underlying HTMLElement
     */
    public toElement(): HTMLElement {
        return this.element;
    }
}