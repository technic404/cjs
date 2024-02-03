class CjsAnimationExecutor {
    constructor() {
    }

    /**
     * Creates simple animation that transforms object by provided value
     * @param {number} offset 
     * @param {number} time animation milliseconds time
     * @returns {string} class name
     */
    x(offset, time = 500) {
        const k = new CjsKeyFrame()
        .setDuration(time)
        .addEntry({ transform: `translateX(${offset}px)` })
        .addEntry({ transform: `translateX(0)` });

        return k.getClass();
    }

    /**
     * Creates simple animation that transforms object by provided value
     * @param {number} offset 
     * @param {number} time animation milliseconds time
     * @returns {string} class name
     */
    y(offset, time = 500) {
        const k = new CjsKeyFrame()
        .setDuration(time)
        .addEntry({ transform: `translateY(${offset}px)` })
        .addEntry({ transform: `translateY(0)` });

        return k.getClass();
    }

    /**
     * Creates simple animation that transforms object by provided value
     * @param {number} start start value of scale to value 1.0
     * @param {number} time animation milliseconds time
     * @returns {string} class name
     */
    scale(start, time = 500) {
        const k = new CjsKeyFrame()
        .setDuration(time)
        .addEntry({ transform: `scale(${start})` })
        .addEntry({ transform: `scale(1)` });

        return k.getClass();
    }

    /**
     * Adds class to element and after selected time removes it
     * @param {HTMLElement} element element to apply class on
     * @param {string} className name of the temp class
     * @param {number} time time in milliseconds after remove the class
     */
    tempClass(element, className, time = 500) {
        element.classList.add(className);

        setTimeout(() => { element.classList.remove(className) }, time);
    }
}

const CjsAnimation = new CjsAnimationExecutor();