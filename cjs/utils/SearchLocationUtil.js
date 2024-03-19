class CjsSearchLocation {
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
    #debugBoxId = "cjs-debug/SearchLocation";

    /** @returns {HTMLElement} */
    #createDebugBox() {
        const box = document.createElement("div");
        box.style.position = `absolute`;
        box.style.bottom = `20px`;
        box.style.right = `20px`;
        box.style.background = `#000000`;
        box.style.color = `#ffffff`;
        box.style.padding = `6px 12px`;
        box.style.border = `2px solid #ffffff`;
        box.style.borderRadius = `6px`;
        box.style.fontFamily = `Consolas, sans-serif`;
        box.style.fontSize = `16px`;
        box.id = this.#debugBoxId;

        const bodyNotLoaded = document.body === null;

        if(bodyNotLoaded) return box;

        document.body.appendChild(box);

        return box;
    }

    #displayOnScreen = true;
    #updateWebsiteUrl = false;

    #localStorageId = "cjsSearchLocation";

    #update() {
        localStorage.setItem(this.#localStorageId, this.search);

        if(this.#displayOnScreen) {
            const debugBox = document.getElementById(this.#debugBoxId) === null 
            ? this.#createDebugBox()
            : document.getElementById(this.#debugBoxId);

            debugBox.innerText = `/${this.search}`;
        }

        if(this.#updateWebsiteUrl) {
            this.#updateUrl();
        }
    }

    constructor() {
        this.search = this.#getDesiredPart(window.location.href);

        this.#update();
    }

    /**
     * If display the actual search in the black box on the website.
     * @param {boolean} displayOnScreen 
     * @returns {SearchLocation}
     */
    setDisplayedOnScreen(displayOnScreen) {
        this.#displayOnScreen = displayOnScreen;

        return this;
    }

    /**
     * Sets the search location to provided value.
     * @param {string} search 
     * @returns {SearchLocation}
     */
    set(search) {
        const parsed = search.replace(new RegExp("/", "g"), "");

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
     * SearchLocation.add("9130148278934798234");
     * ```
     * 
     * `https://domain.pl/channels/9130148278934798234`
     * @param {string} value 
     * @returns {SearchLocation}
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
     * SearchLocation.remove(2);
     * ```
     * `https://domain.pl/`
     * 
     * @param {number} count 
     * @returns {SearchLocation}
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

const SearchLocation = new CjsSearchLocation();