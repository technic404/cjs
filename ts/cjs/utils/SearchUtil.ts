import { CJS_PRETTY_PREFIX_X } from "../Constants";
import { htmlToElement } from "../utils/ElementUtil";

type SearchMode = "query" | "path";

type SearchListener = (data: {
    search: string;
    parts: string[];
    length: number;
}) => void;

export class CjsSearch {

    // ------------------------
    // Private Fields
    // ------------------------

    #debugBoxId = "cjs-debug/Search";
    #displayOnScreen = true;
    #updateWebsiteUrl = true;
    #localStorageId = "cjsSearch";

    #listeners: SearchListener[] = [];

    // ------------------------
    // Public State
    // ------------------------

    _mode: SearchMode = "query";
    length = 0;
    search = "";

    // ------------------------
    // Constructor
    // ------------------------

    constructor() {

        // Initialize search from URL if needed
        this.search = "";

        window.addEventListener("popstate", () => {

            const currentUrl = new URL(window.location.href);

            const path =
                this._mode === "query"
                    ? currentUrl.searchParams.get("path")
                    : currentUrl.pathname.replace(/^\/|\/$/g, "");

            if (path) {
                this.set(path);
            }
        });
    }

    // ------------------------
    // Private Helpers
    // ------------------------

    #getDesiredPart(href: string): string {
        return new URL(href).pathname.substring(1);
    }

    #parseSearch(search: string): string {

        if (!search) return "";

        if (search.charAt(0) === "/") {
            search = search.slice(1);
        }

        if (search.charAt(search.length - 1) === "/") {
            search = search.slice(0, -1);
        }

        return search;
    }

    #updateUrl(): void {

        const modes: Record<SearchMode, () => void> = {
            query: () => {

                const currentUrl = new URL(window.location.href);

                currentUrl.searchParams.set("path", this.search);

                history.pushState({}, "", currentUrl);
            },

            path: () => {
                history.pushState(null, "", `/${this.search}`);
            }
        };

        modes[this._mode]();

        window.dispatchEvent(new Event("popstate"));
    }

    #createDebugBox(): HTMLElement {

        const element = htmlToElement(`
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #000000;
                padding: 6px 12px;
                border: 2px solid #ffffff;
                border-radius: 6px;
            " id="${this.#debugBoxId}">
                <p style="
                    font-family: Consolas, sans-serif;
                    margin: 0;
                    color: #acacac;
                    font-size: 10px;
                    user-select: none;
                ">Search url</p>
                <p style="
                    font-family: Consolas, sans-serif;
                    margin: 0;
                    color: #ffffff;
                    font-size: 15px;
                "></p>
            </div>
        `);

        if (document.body) {
            document.body.appendChild(element);
        }

        return element;
    }

    // ------------------------
    // Public API
    // ------------------------

    setMode(mode: SearchMode): void {
        this._mode = mode;
    }

    setDisplayedOnScreen(display: boolean): this {
        this.#displayOnScreen = display;
        return this;
    }

    onChange(callback: SearchListener): this {
        this.#listeners.push(callback);
        return this;
    }

    set(search: string, forceRerender = false): this {

        const parsed = this.#parseSearch(search);
        const notChanged = this.search === parsed;

        if (notChanged && !forceRerender) return this;

        this.search = parsed;
        this.update();

        return this;
    }

    setQuiet(search: string): this {

        this.search = this.#parseSearch(search);
        this.update(true);

        return this;
    }

    update(quiet = false): void {

        localStorage.setItem(this.#localStorageId, this.search);

        const parts = this.search
            .split("/")
            .filter(e => e.trim() !== "");

        this.length = parts.length;

        if (!quiet) {
            this.#listeners.forEach(listener =>
                listener({
                    search: this.search,
                    parts,
                    length: this.length
                })
            );
        }

        if (this.#displayOnScreen) {

            const existing =
                document.getElementById(this.#debugBoxId);

            const debugBox =
                existing ?? this.#createDebugBox();

            const paragraph = debugBox.querySelector("p:nth-child(2)");

            if (paragraph) {
                paragraph.innerHTML = `/${this.search}`;
            }
        }

        if (this.#updateWebsiteUrl) {
            this.#updateUrl();
        }
    }

    equals(text: string): boolean {

        if (text === this.search) return true;

        return this.search === this.#parseSearch(text);
    }

    startsWith(text: string): boolean {
        return this.search.startsWith(this.#parseSearch(text));
    }

    slice(start: number, end: number | null = null): string {

        const parts = this.search
            .split("/")
            .filter(e => e.trim() !== "");

        if (end === null) {
            return parts.slice(start).join("/");
        }

        return parts.slice(start, end).join("/");
    }

    get(index: number): string | null {

        const split = this.search.split("/");
        const outOfRange = index > split.length - 1;

        if (outOfRange) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided index is too high.`);
            return null;
        }

        return split[index];
    }

    add(value: string): this {

        const sanitized = value.replace(/\//g, "");

        this.search +=
            this.search.trim().length === 0
                ? sanitized
                : `/${sanitized}`;

        this.update();

        return this;
    }

    remove(count: number): this {

        const split = this.search.split("/");
        const outOfRange = count > split.length - 1;

        if (outOfRange) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided index is too high.`);
            return this;
        }

        const cut = split.slice(0, split.length - count);

        this.search = cut.join("/");
        this.update();

        return this;
    }
}

export const Search = new CjsSearch();