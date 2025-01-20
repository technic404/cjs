class CjsScaleHoverPlugin extends CjsPlugin {
    /** @type {string} Name of the attribute, to apply hover scale effect */
    #attribute = 'hover';

    /** @type {number} Animation time in ms */
    #animationTime = 350;

    /** @type {number} End scale in `transform: scale(...)` on `:hover` */
    #hoverScale = 0.95;

    #addStyles() {
        const style = document.getElementById(CJS_STYLE_PLUGINS_PREFIX);

        const selectors = {
            [`[${this.#attribute}]`]: [
                `transition: transform ${this.#animationTime}ms !important;`,
            ],
            [`[${this.#attribute}]:hover`]: [
                `transform: scale(${this.#hoverScale}) !important;`,
            ]
        };

        for(const [selector, rules] of Object.entries(selectors)) {
            style.innerHTML += `${selector} { \n${rules.map(e => `    ${e}`).join("\n")} \n}\n`;
        }
    }

    enable() {
        this.#addStyles();
    }
}