class Reference {
    constructor() {
        this.id = `${CJS_REFERENCE_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`
    }

    /**
     * Returns element in with reference was pasted
     * @return {Element}
     */
    getElement() {
        const foundElement = document.body.querySelector(`[${this.id}='']`);

        if(foundElement === null) {
            console.log(`${CJS_PRETTY_PREFIX_X}Reference element with attribute "${this.id}" doesn't exists in body, make sure that you are using getElement() in correct place.`)
        }

        return foundElement;
    }

    insert(html) {
        this.getElement().innerHTML = html;
    }

    clearContent() {
        this.insert('');
    }

    appendBefore(html) {
        this.getElement().insertAdjacentHTML(`afterbegin`, html);
    }

    appendAfter(html) {
        this.getElement().insertAdjacentHTML(`beforeend`, html);
    }

    appendElement(element) {
        const appendReferenceElements = () => {
            this.getElement().insertAdjacentElement(`beforeend`, element);

            for(const child of [element, ...element.querySelectorAll("*")]) {
                functionMappings.applyElementMappingFunction(child, true);
            }
        }

        // check on that, status complete is when all images and assets are loaded on website
        // we can try to bypass that assets (like images) loading and just start loading
        if(["complete"].includes(document.readyState)) {
            appendReferenceElements();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                appendReferenceElements();
            });
        }
    }

    /**
     *
     * @param {Element[]} elements
     */
    appendElements(elements) {
        elements.forEach(element => { this.appendElement(element); });
    }

    clear() {
        this.getElement().innerHTML = ``;
    }

    toString() {
        return ` ${this.id} `;
    }
}