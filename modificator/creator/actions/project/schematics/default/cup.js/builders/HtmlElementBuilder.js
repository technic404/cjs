class HtmlElement {
    constructor(html) {
        this.element = htmlToElement(html);
    }

    insert(html) {
        this.element.innerHTML = html;

        return this;
    }

    clearContent() {
        this.insert('');
    }

    appendBefore(html) {
        this.element.insertAdjacentHTML(`afterbegin`, html);

        return this;
    }

    appendAfter(html) {
        this.element.insertAdjacentHTML(`beforeend`, html);

        return this;
    }

    toHtml() {
        return this.element.outerHTML;
    }

    toElement() {
        return htmlToElement(this.element.outerHTML);
    }
}

function createElement(html) {
    return new HtmlElement(html);
}