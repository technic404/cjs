class CjsSearch {
    /**
     * Returns the specific url part without domain and query search
     * 
     * `https://domain.pl/`**`channel/4718230`**`?option=sort`
     * @param {string} href 
     * @returns {string}
     */
    #getDesiredPart(href) {
        return new URL(href).pathname.substring(1);
    }

    /**
     * Updates the website url
     */
    #updateUrl() {
        let currentUrl = new URL(window.location.href);

        currentUrl.searchParams.set('path', this.search);

        history.replaceState({}, '', currentUrl);
        window.dispatchEvent(new Event('popstate'));
    }

    /** @type {string} */
    #debugBoxId = "cjs-debug/Search";

    /** @returns {HTMLElement} */
    #createDebugBox() {
        const element = htmlToElement(`
            <div style="
                position: absolute;
                bottom: 20px;
                right: 20px;
                background: #000000;
                padding: 6px 12px;
                border: 2xp solid #ffffff;
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

        const bodyNotLoaded = document.body === null;

        if(bodyNotLoaded) return element;

        document.body.appendChild(element);

        return element;
    }

    #displayOnScreen = true;
    #updateWebsiteUrl = false;

    #localStorageId = "cjsSearch";

    /** @type {function()[]} */
    #listeners = [];

    /** @type {number} */
    length = 0;

    #update() {
        localStorage.setItem(this.#localStorageId, this.search);

        this.length = this.search.split("/").filter(e => e.trim() !== "").length;

        this.#listeners.forEach(listener => listener());

        if(this.#displayOnScreen) {
            const debugBox = document.getElementById(this.#debugBoxId) === null 
            ? this.#createDebugBox()
            : document.getElementById(this.#debugBoxId);

            debugBox.querySelector("p:nth-child(2)").innerText = `/${this.search}`;
        }

        if(this.#updateWebsiteUrl) {
            this.#updateUrl();
        }
    }

    constructor() {
        this.search = ""; //this.#getDesiredPart(window.location.href)

        this.#update();
    }

    /**
     * If display the actual search in the black box on the website.
     * @param {boolean} displayOnScreen 
     * @returns {CjsSearch}
     */
    setDisplayedOnScreen(displayOnScreen) {
        this.#displayOnScreen = displayOnScreen;

        return this;
    }

    /**
     * Adds listener and calls it when search changes
     * @param {function} callback 
     * @returns {CjsSearch}
     */
    addListener(callback) {
        this.#listeners.push(callback);

        return this;
    }

    /**
     * Sets the search location to provided value.
     * @param {string} search 
     * @returns {CjsSearch}
     */
    set(search) {
        const parsed = search.charAt(0) === "/" ? search.slice(1) : search;

        this.search = parsed;

        this.#update();

        return this;
    }

    /**
     * Retrieves data from search location
     * @param {number} index 
     * @returns {string|null}
     */
    get(index) {
        const split = this.search.split("/");
        const isOutOfRange = index > split.length - 1

        if(isOutOfRange) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided index is too high.`);
            
            return null;
        }

        return split[index];
    }

    /**
     * Adds value to url
     * 
     * `https://domain.pl/channels`
     * 
     * ```js
     * Search.add("9130148278934798234");
     * ```
     * 
     * `https://domain.pl/channels/9130148278934798234`
     * @param {string} value 
     * @returns {CjsSearch}
     */
    add(value) {
        const parsed = value.replace(new RegExp("/", "g"), "");

        this.search += this.search.trim().length === 0 ? `${parsed}` : `/${parsed}`;

        this.#update();

        return this;
    }

    /**
     * Removes the number of search entries separated by "/"
     * 
     * `https://domain.pl/channels/9130148278934798234`
     * ```js
     * Search.remove(2);
     * ```
     * `https://domain.pl/`
     * 
     * @param {number} count 
     * @returns {CjsSearch}
     */
    remove(count) {
        const split = this.search.split("/");
        const isOutOfRange = count > split.length - 1;

        if(isOutOfRange) {
            console.log(`${CJS_PRETTY_PREFIX_X}Provided index is too high.`);
            
            return this;
        }

        const cuttedSearch = split.slice(0, split.length - count);

        this.search = cuttedSearch.join("/");

        this.#update();

        return this;
    }
}

const Search = new CjsSearch();