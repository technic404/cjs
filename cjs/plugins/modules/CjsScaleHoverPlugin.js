class CjsScaleHoverPlugin extends CjsPlugin {
    /** @type {string} Name of the attribute, to apply hover scale effect */
    #attribute = 'hover';

    /** @type {number} Animation time in ms */
    #animationTime = 350;

    /** @type {number} End scale in `transform: scale(...)` on `:hover` */
    #hoverScale = 0.95;

    #addStyles() {
        this._addStyleRules({
            [`[${this.#attribute}]`]: [
                `transition: transform ${this.#animationTime}ms !important;`,
            ],
            [`[${this.#attribute}]:hover`]: [
                `transform: scale(${this.#hoverScale}) !important;`,
            ]
        });
    }

    enable() {
        this.#addStyles();
    }
}