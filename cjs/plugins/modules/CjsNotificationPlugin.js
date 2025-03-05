class CjsNotificationPlugin extends CjsPlugin {
    #containerId = "cjs-notification-plugin-container";
    #keyframe = {
        name: "cjs-notification-plugin",
        duration: 4000,
        showHideOffset: 10,
        yDiff: 8
    };

    #themes = {
        dark: {
            backgroundColor: "#242323",
        },
        light: {
            backgroundColor: "#ffffff"
        }
    };

    #addStyles() {
        const theme = "dark";
        const oppositeTheme = theme === "dark" ? "light" : "dark";

        this._addStyleRules({
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
                `border-radius: 14px;`,
                `padding: 8px;`,
                `width: fit-content;`,
                `display: flex;`,
                `align-items: center;`,
                `gap: 5px;`,
                `opacity: 0;`,
                `transform: translateY(0px);`,
                `filter: drop-shadow(1px 2px 3px black);`,
                `animation: ${this.#keyframe.name} ${this.#keyframe.duration}ms`
            ],
            [`#${this.#containerId}.container > .notification.warning`]: [
                `background: #c0bd00;`,
            ],
            [`#${this.#containerId}.container > .notification.error`]: [
                `background: #de1f1f;`,
            ],
            [`#${this.#containerId}.container > .notification.info`]: [
                `background: #0e73ff;`,
            ],
            [`#${this.#containerId}.container > .notification.success`]: [
                `background: #00b600;`,
            ],
            [`#${this.#containerId}.container > .notification > p`]: [
                `color: ${this.#themes[oppositeTheme].backgroundColor};`,
                `margin: 0;`,
                `font-size: 16px;`,
                `display: -webkit-box;`,
                `-webkit-line-clamp: 1;`,
                `-webkit-box-orient: vertical;`,
                `overflow: hidden;`
            ],
            [`#${this.#containerId}.container > .notification > .icon`]: [
                `--size: 22px;`,
                // `font-size: var(--size);`,
                // `border-radius: 6px;`,
                `width: var(--size);`,
                `height: var(--size);`,
                // `background: ${this.#themes[oppositeTheme].backgroundColor};`,
                // `color: ${this.#themes[theme].backgroundColor};`,
                // `text-align: center;`,
                // `line-height: calc(var(--size) - 1px);`,
                // `margin-right: 6px;`,
                // `user-select: none;`,
            ],
            [`#${this.#containerId}.container > .notification > .icon > svg`]: [

            ],
            [`@keyframes ${this.#keyframe.name}`]: [
                `0% { opacity: 0; transform: translateY(${this.#keyframe.yDiff}px); }`,
                `${this.#keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.#keyframe.yDiff}px); }`,
                `${100 - this.#keyframe.showHideOffset}% { opacity: 1; transform: translateY(-${this.#keyframe.yDiff}px); }`,
                `100% { opacity: 0; transform: translateY(${this.#keyframe.yDiff}px); }`
            ]
        })
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

    /**
     * @param {string} text
     * @param {"success"|"error"|"info"|"warning"} type
     */
    #create(text, type) {
        const container = document.getElementById(this.#containerId) || this.#createContainer();

        const svgIcon = {
            "success": `<svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark1</title> <path d="M21.82 13.030l-1.002-1.002c-0.185-0.185-0.484-0.185-0.668 0l-6.014 6.013-2.859-2.882c-0.186-0.185-0.484-0.185-0.67 0l-1.002 1.003c-0.185 0.185-0.185 0.484 0 0.668l4.193 4.223c0.185 0.184 0.484 0.184 0.668 0l7.354-7.354c0.186-0.185 0.186-0.484 0-0.669zM16 3c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zM16 26c-5.522 0-10-4.478-10-10 0-5.523 4.478-10 10-10 5.523 0 10 4.477 10 10 0 5.522-4.477 10-10 10z"></path> </g></svg>`,
            "error": `<svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>error</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#ffffff" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C331.136,3.55271368e-14 426.666667,95.5306667 426.666667,213.333333 C426.666667,331.136 331.136,426.666667 213.333333,426.666667 C95.5306667,426.666667 3.55271368e-14,331.136 3.55271368e-14,213.333333 C3.55271368e-14,95.5306667 95.5306667,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,42.6666667 C119.232,42.6666667 42.6666667,119.232 42.6666667,213.333333 C42.6666667,307.434667 119.232,384 213.333333,384 C307.434667,384 384,307.434667 384,213.333333 C384,119.232 307.434667,42.6666667 213.333333,42.6666667 Z M262.250667,134.250667 L292.416,164.416 L243.498667,213.333333 L292.416,262.250667 L262.250667,292.416 L213.333333,243.498667 L164.416,292.416 L134.250667,262.250667 L183.168,213.333333 L134.250667,164.416 L164.416,134.250667 L213.333333,183.168 L262.250667,134.250667 Z" id="error"> </path> </g> </g> </g></svg>`,
            "info": `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"></path> </g></svg>`,
            "warning": `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd" fill="#ffffff"></path></g></svg>`
        }

        const element = htmlToElement(/*html*/`
            <div class="notification ${type}">
                <div class="icon">${svgIcon[type]}</div>
                <p>${text}</p>
            </div>
        `);

        container.appendChild(element);

        sleep(this.#keyframe.duration).then(() => element.remove());
    }

    info(text) { this.#create(text, "info"); }
    error(text) { this.#create(text, "error"); }
    warning(text) { this.#create(text, "warning"); }
    success(text) { this.#create(text, "success"); }

    enable() {
        this.#addStyles();
    }
}