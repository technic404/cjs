class CjsRunnable {
    constructor() {
        /**
         * @type {{ compiled?: boolean, relativePathPosition?: number, tempWebServerPort?: number, style: { map: Map } }}
         */
        this.data = {};
    }

    /**
     * If runnable variable is present
     * @returns {boolean}
     */
    exists() {
        const runnableExists = typeof CjsRunnableDetails !== 'undefined';

        return runnableExists;
    }

    import() {
        if(!this.exists()) return;

        this.data = CjsRunnableDetails;
    }

    isCompiled() {
        return "compiled" in this.data && this.data.compiled;
    }

    getTempWebServerPort() {
        return this.data.tempWebServerPort;
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