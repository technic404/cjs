class CjsRipplePlugin extends CjsPlugin {
    /** @type {string} Name of the attribute, to apply ripple effect */
    #attribute = 'ripple';

    /** @type {number} Animation time in ms */
    #animationTime = 400;

    #cssVariables = {
        s: "sx",
        t: "tx", // animation time
        o: "ox", // opacity
        d: "dx", // width, height
        x: "xx", // position
        y: "yx" // position
    }

    /**
     * Applies the effect, adds click listener to element
     * @param {HTMLElement} element 
     */
    #applyEffect(element) {
        element.addEventListener('click', e => {
            e = e.touches ? e.touches[0] : e;

            const r = element.getBoundingClientRect();
            const d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 2;

            element.style.cssText = `--${this.#cssVariables.s}: 0; --${this.#cssVariables.o}: 1;`;
            element.offsetTop;
            element.style.cssText = `--${this.#cssVariables.t}: 1; --${this.#cssVariables.o}: 0; --${this.#cssVariables.d}: ${d}; --${this.#cssVariables.x}:${e.clientX - r.left}; --${this.#cssVariables.y}:${e.clientY - r.top};`;
        });
    }

    #addStyles() {
        const cssAnimationTime = `${this.#animationTime}ms`;

        this._addStyleRules({
            [`[${this.#attribute}]`]: [
                `cursor: pointer;`,
                `overflow: hidden;`,
                `position: relative;`,
                `-webkit-user-select: none;`,
                `-moz-user-select: none;`,
                `-ms-user-select: none;`,
                `user-select: none;`,
                `-webkit-tap-highlight-color: rgba(0, 0, 0, 0);`,
            ],
            [`[${this.#attribute}]:before`]: [
                `content: '';`,
                `display: block;`,
                `border-radius: 50%;`,
                `position: absolute;`,
                `pointer-events: none;`,
                `transform-origin: center;`,
                `top: calc(var(--${this.#cssVariables.y}) * 1px);`,
                `left: calc(var(--${this.#cssVariables.x}) * 1px);`,
                `width: calc(var(--${this.#cssVariables.d}) * 1px);`,
                `height: calc(var(--${this.#cssVariables.d}) * 1px);`,
                `background: var(--ripple-background, white);`,
                `transform: translate(-50%, -50%) scale(var(--${this.#cssVariables.s}, 1));`,
                `opacity: calc(var(--${this.#cssVariables.o}, 1) * var(--ripple-opacity, 0.3));`,
                `transition: calc(var(--${this.#cssVariables.t}, 0) * var(--ripple-duration, ${cssAnimationTime})) var(--ripple-easing, linear);`,
            ]
        });
    }

    /**
     * Enables the plugin
     */
    enable() {
        this.#addStyles();

        window.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll(`[${this.#attribute}]`).forEach(el => {
                this.#applyEffect(el);
            });
        });

        const observer = new MutationObserver((mutations) => {
            const filtered = mutations
                .filter(mutation => mutation.type === 'childList')
                .map(mutation => Array.from(mutation.addedNodes))
                .flat()
                .filter(addedNode => "getAttribute" in addedNode)
                .map(addedNode => [addedNode, ...addedNode.querySelectorAll("*")])
                .flat()
                .filter(element => element.getAttribute(this.#attribute) !== null);

            for(const element of filtered) {
                this.#applyEffect(element);
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }
}