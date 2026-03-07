import { CjsLayoutNode } from "../types";
import { CjsComponent } from "./CjsComponent";
import { CjsLayout } from "./CjsLayout";

export const CjsPages: CjsPage[] = [];

export class CjsPage extends CjsLayout {

    public readonly basename: string;

    /**
     * @param basename Page URL basename
     * @param elements Layout / Components
     */
    constructor(basename: string, elements: CjsLayoutNode[][]) {
        super(() => elements);

        this.basename = basename;

        registerPage(this);
    }
}

function registerPage(page: CjsPage): void {
    const exists = CjsPages.some(p => p.basename === page.basename);

    if (exists) {
        console.warn(`Page with basename "${page.basename}" already registered.`);
        return;
    }

    CjsPages.push(page);
}