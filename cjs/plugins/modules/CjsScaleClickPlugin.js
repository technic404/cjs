class CjsScaleClickPlugin extends CjsPlugin {
    /** @type {string} Name of the attribute, to apply ripple effect */
    #attribute = 'scale';

    /** @type {number} Animation time in ms */
    #animationTime = 350;

    scales = { start: 0.85, end: 1 }
    keyframe = new CjsKeyFrame()
        .setDuration(this.#animationTime)
        .addEntry({ transform: `scale(${this.scales.start})` })
        .addEntry({ transform: `scale(${this.scales.end})` })

    /**
     * @param {HTMLElement} element 
     * @param {boolean} isTouchStart 
     */
    #onTouch(element, isTouchStart) {
        const className = this.keyframe.getClass({ reversed: isTouchStart });
        const endScale = isTouchStart ? this.scales.start : this.scales.end;

        element.classList.add(className);
        element.style.transform = `scale(${endScale})`

        setTimeout(() => {
            element.classList.remove(className);

            if(!isTouchStart) {
                element.style.transform = '';
            }
        }, this.duration);
    }

    /**
     * @param {HTMLElement} element 
     */
    applyEvents(element) {
        element.addEventListener('touchstart', () => { this.#onTouch(element, true) });
        element.addEventListener('touchend', () => { this.#onTouch(element, false) });
    }

    enable() {
        window.addEventListener('DOMContentLoaded', () => {
            const elements = document.querySelectorAll(`[${this.#attribute}]`);

            elements.forEach(element => { this.applyEvents(element) });
        })

        new MutationObserver((mutationsList, observer) => {
            const childList = mutationsList.filter(e => e.type === 'childList');
            const addedNodes = childList.map(e => Array.from(e.addedNodes)).flat();
            const addedNodesWithChildren = addedNodes
                .filter(e => e instanceof HTMLElement)
                .map(e => [e, ...Array.from(e.querySelectorAll("*"))])
                .flat()
                .filter(e => e.getAttribute(this.#attribute) !== null);

            for(const node of addedNodesWithChildren) {
                this.applyEvents(node);
            }
        }).observe(document, { childList: true, subtree: true });
    }
}