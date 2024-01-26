class CjsAnimationExecutor {
    constructor() {
    }

    /**
     * Creates simple animation that transforms object by provided value
     * @param {number} offset 
     * @param {number} time animation miliseconds time
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
     * @param {number} time animation miliseconds time
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
     * @param {number} time animation miliseconds time
     * @returns {string} class name
     */
    scale(start, time = 500) {
        const k = new CjsKeyFrame()
        .setDuration(time)
        .addEntry({ transform: `scale(${start})` })
        .addEntry({ transform: `scale(1)` });

        return k.getClass();
    }
}

const CjsAnimation = new CjsAnimationExecutor();