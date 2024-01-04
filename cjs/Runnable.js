class CjsRunnable {
    constructor() {
        this.data = {};
    }

    import() {
        const runnableExists = typeof CjsRunnableDetails !== 'undefined';

        if(!runnableExists) return;

        this.data = CjsRunnableDetails;
    }

    hasStyle() { return ("style" in this.data) }
    isStyleValid() {
        return (
            this.hasStyle() &&
            ("map" in this.data.style)
        )
    }
    validateStyle() {
        if(!("map" in this.data.style)) {
            console.log(`${CJS_PRETTY_PREFIX_X}Map is not present in runnable style configuration`)
        }
    }

    validate() {
        if(this.hasStyle()) {
            this.validateStyle();

            if("map" in this.data.style) {
                console.log(`${CJS_PRETTY_PREFIX_I}Please note that style compiler does not support import options: prefixStyleRules, encodeKeyframes, enableMultiSelector`)
            }
        }
    }
}

const cjsRunnable = new CjsRunnable();

cjsRunnable.import();
cjsRunnable.validate();