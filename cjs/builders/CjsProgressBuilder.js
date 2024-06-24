/**
 * @class
 * @classdesc Class util for creating a <progress> elements
 * @example 
 * ```js
 * // Creating a progress with lime color
 * export const Container = new CjsComponent((data) => {
 *     const progress = new CjsProgressBuilder()
 *     .setProperties({
 *         fillColor: "lime"
 *     });
 *     
 *     return `
 *         <div class="container">
 *             ${progress}
 *         </div>
 *     `;
 * });
 * ```
 */
class CjsProgressBuilder {
    fillColor = "dodgerblue";
    backgroundColor = "#393939";
    border = "none";
    borderRadius = "8px";
    height = "12px";
    width = "100%";

    max = 100;
    value = 75;
    valueTransitionDuration = 1000;

    className = CJS_PREFIX + getRandomCharacters(16);
    selector = `progress.${this.className}`;

    /**
     * @param {function(HTMLProgressElement)} callback 
     */
    #forEach(callback) {
        const elements = Array.from(document.body.querySelectorAll(this.selector));

        for(const element of elements) {
            callback(element);
        }
    }

    /**
     * Sets progress value transition time (in ms)
     * @param {number} ms 
     * @returns {CjsProgressBuilder}
     */
    setValueTransitionDuration(ms) {
        this.valueTransitionDuration = ms;

        return this;
    }

    /**
     * Sets max value of progress range
     * @param {number} max 
     * @returns {CjsProgressBuilder}
     */
    setMax(max) {
        this.max = max;

        this.#forEach((element) => element.max = this.max);

        return this;
    }

    /**
     * Sets value of progress
     * @param {number} value 
     * @returns {CjsProgressBuilder}
     */
    setValue(value) {
        this.value = value;

        this.#forEach((element) => element.value = this.value);

        return this;
    }

    /**
     * Sets base style properties of `<progress>`
     * @param {{ fillColor?: string, backgroundColor?: string, border?: string, borderRadius?: string, height: string, width: string }} properties 
     * @return {CjsProgressBuilder}
     */
    setProperties(properties) {
        const propertiesList = [
            "fillColor",
            "backgroundColor",
            "border",
            "borderRadius",
            "height",
            "width"
        ];

        for(const propertyName of propertiesList) {
            if(propertyName in properties) this[propertyName] = properties[propertyName];
        }

        return this;
    }

    toString() {
        return this.toHtml();
    }

    toHtml() {
        const styleProperties = [
            { key: "appearance", value: "none" },
            { key: "-webkit-appearance", value: "none" },
            { key: "-moz-appearance", value: "none" },
            { key: "overflow", value: "hidden" },
            { key: "border", value: this.border },
            { key: "border-radius", value: this.borderRadius },
            { key: "width", value: this.width },
            { key: "height", value: this.height },
        ];

        const styles = {
            "": styleProperties.map(e => `${e.key}: ${e.value};`),
            "::-webkit-progress-bar": [
                `background: ${this.backgroundColor};`,
                `border-radius: ${this.borderRadius};`
            ],
            "::-webkit-progress-value": [
                `background: ${this.fillColor};`,
                `border-radius: ${this.borderRadius};`,
                `transition: width ${this.valueTransitionDuration}ms;`
            ],
            "::-moz-progress-bar": [
                `background: ${this.fillColor};`,
                `border-radius: ${this.borderRadius};`
            ]
        };

        const styleBlock = `<style>${Object.keys(styles).map(key => `${this.selector}${key} { \n${styles[key].map(e => `    ${e}`).join("\n")} \n}`).join("\n")}</style>`;

        const html = `<progress class="${this.className}" value="${this.value}" max="${this.max}">${styleBlock}</progress>`;

        return html;
    }

    /**
     * @returns {HTMLProgressElement}
     */
    toElement() {
        return htmlToElement(this.toHtml());
    }
}