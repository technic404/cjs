/**
 * Definition of Root website class
 */

import { CJS_PRETTY_PREFIX_X, CJS_STYLE_PREFIX } from "./Constants";
import { CjsCursorTypes } from "./types";
import { CjsRequest } from "./utils/public/CjsRequestsUtil";
import { addPrefixToSelectors } from "./utils/StyleUtil";

type WebsiteData = {
    title: string;
    icon: string | null;
};

type WebsiteDataInput = {
    title?: string;
    icon?: string | null;
};

class CjsRoot {
    private website: WebsiteData;

    constructor() {
        this.website = {
            title: "New project",
            icon: null,
        };
    }

    /**
     * Sets cursor for the body (whole website)
     */
    setCursor(cursor: CjsCursorTypes): void {
        document.body.style.cursor = cursor;
    }

    setDocumentData(data: WebsiteDataInput): void {
        // Set default values for missing options in data object
        this.website = { ...this.website, ...data } as WebsiteData;
    
        Object.assign(data, this.website);

        const createLink = (rel: string, href: string | null) => {
            if (href === null) return;

            const element = document.createElement("link");
            element.rel = rel;
            element.href = href;

            document.head.appendChild(element);
        };

        document.title = data.title ?? this.website.title;
        document.head.appendChild(document.createComment("Meta definitions"));

        // Links
        createLink("icon", data.icon ?? this.website.icon);
    }

    async importStyle(path: string): Promise<void> {
        const style = document.head.querySelector<HTMLStyleElement>(`[id="${CJS_STYLE_PREFIX}"]`);

        if (!style) return;

        const request = await new CjsRequest(path, "get").doRequest();

        if (request.isError()) {
            console.log(`${CJS_PRETTY_PREFIX_X}Error importing root style at path "${path}"`);
            return;
        }

        const definitions = addPrefixToSelectors(request.text());

        style.innerHTML += definitions;
    }
}

export const Root = new CjsRoot();
