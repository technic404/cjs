class CjsNotificationPlugin extends CjsPlugin {
    #containerId = "cjs-notification-plugin-container";
    #keyframe = {
        name: "cjs-notification-plugin",
        duration: 5000,
        showHideOffset: 10,
        yDiff: 5
    }

    #themes = {
        dark: {
            backgroundColor: "#242323",
        },
        light: {
            backgroundColor: "#e9e9e9"
        }
    }

    #addStyles() {
        const style = document.getElementById(CJS_STYLE_PLUGINS_PREFIX);
        const theme = "dark";
        const oppositeTheme = theme === "dark" ? "light" : "dark";

        const selectors = {
            [`#${this.#containerId}.container`]: [
                `position: fixed;`,
                `bottom: 0;`,
                `z-index: 999999999999;`,
                `width: 100%;`,
                `display: flex;`,
                `align-items: center;`,
                `flex-direction: column;`,
                `gap: ${this.#keyframe.yDiff}px;`
            ],
            [`#${this.#containerId}.container > .notification`]: [
                `background: ${this.#themes[theme].backgroundColor};`,
                `border-radius: 10px;`,
                `padding: 6px;`,
                `width: fit-content;`,
                `display: flex;`,
                `align-items: center;`,
                `opacity: 0;`,
                `transform: translateY(0px);`,
                `animation: ${this.#keyframe.name} ${this.#keyframe.duration}ms`
            ],
            [`#${this.#containerId}.container > .notification > p`]: [
                `color: ${this.#themes[oppositeTheme].backgroundColor};`,
                `margin: 0;`,
                `font-size: 16px;`,
            ],
            [`#${this.#containerId}.container > .notification > .icon`]: [
                `--size: 20px;`,
                `font-size: var(--size);`,
                `border-radius: 6px;`,
                `width: var(--size);`,
                `height: var(--size);`,
                `background: ${this.#themes[oppositeTheme].backgroundColor};`,
                `color: ${this.#themes[theme].backgroundColor};`,
                `text-align: center;`,
                `line-height: calc(var(--size) - 2px);`,
                `margin-right: 4px;`,
                `user-select: none;`,
            ],
            [`@keyframes ${this.#keyframe.name}`]: [
                `0% { opacity: 0; transform: translateY(${this.#keyframe.yDiff}px); }`,
                `${this.#keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.#keyframe.yDiff}px); }`,
                `${100 - this.#keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.#keyframe.yDiff}px); }`,
                `100% { opacity: 0; transform: translateY(${this.#keyframe.yDiff}px); }`
            ]
        };

        for(const [selector, rules] of Object.entries(selectors)) {
            style.innerHTML += `${selector} { \n${rules.map(e => `    ${e}`).join("\n")} \n}\n`;
        }
    }

    /**
     * Creates the container for notifications
     * @returns {HTMLElement} Notifications container
     */
    #createContainer() {
        const element = htmlToElement(`
            <div id="${this.#containerId}" class="container">
            </div>
        `);

        document.body.appendChild(element);

        return element;
    }

    createNotification(text) {
        const container = document.getElementById(this.#containerId) || this.#createContainer();

        const element = htmlToElement(/*html*/`
            <div class="notification">
                <div class="icon">🛈</div>
                <p>${text}</p>
            </div>
        `);

        container.appendChild(element);

        sleep(this.#keyframe.duration).then(() => element.remove());
    }

    enable() {
        this.#addStyles();
    }
}