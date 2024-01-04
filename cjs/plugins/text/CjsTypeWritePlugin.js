class CjsTypeWrite {
    constructor() {
        this.text = null;
        this.element = null;
        this.overwriteElementInner = false;
        this.duration = 500;
        this.finishCallback = function () {};
    }

    /**
     *
     * @param {Boolean} overwriteElementInner
     * @returns {CjsTypeWrite}
     */
    setOverwriteElementInner(overwriteElementInner) {
        this.overwriteElementInner = overwriteElementInner;

        return this;
    }

    /***
     *
     * @param {String} text
     * @returns {CjsTypeWrite}
     */
    setText(text) {
        this.text = text;

        return this;
    }

    /**
     *
     * @param {HTMLElement} element
     * @returns {CjsTypeWrite}
     */
    setElement(element) {
        this.element = element;

        return this;
    }

    /**
     *
     * @param {Number} duration in ms
     * @returns {CjsTypeWrite}
     */
    setDuration(duration) {
        this.duration = duration;

        return this;
    }

    /**
     *
     * @param {function(duration: number)} callback
     * @returns {CjsTypeWrite}
     */
    onFinish(callback) {
        this.finishCallback = callback;

        return this;
    }

    async execute() {
        if(!this.element) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Typewrite element is not set`)
        }

        if(this.text === null) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Typewrite text is not set`)
        }

        const textLength = this.text.length;
        const textSplit = this.text.split("");

        let charCounter = 0;
        let charIncrementBy = 1;

        let step = (this.duration / textLength);

        while(step < 4) {
            charIncrementBy++;
            step = this.duration / (textLength / charIncrementBy)
        }

        const start = new Date().getTime();

        const interval = setInterval(() => {
            const charsToAppend = textSplit.slice(charCounter, charCounter + charIncrementBy).join("")

            this.element.innerHTML += charsToAppend;

            charCounter += charIncrementBy;

            if(charCounter >= textLength) {
                clearInterval(interval);

                const duration = new Date().getTime() - start;

                this.finishCallback(duration);
            }
        }, step)
    }
}