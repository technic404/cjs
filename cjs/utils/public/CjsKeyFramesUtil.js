const CJS_KEYFRAMES_ANIMATIONS = []; // { hash: number, animation: string }
const CJS_KEYFRAMES_CLASSES = []; // { hash: number, class: string }

class CjsKeyFrame {
    constructor() {
        this.entries = [];
        this.duration = 1000;
        this.timingFunction = 'ease';
        this.keepEndingEntryStyle = true;
        this.selector = '';
        this.isImportant = false;
        this.fillMode = '';
    }

    /**
     * Set selector of class, so the animation could be applied to child divs if for example selector is ".animationClass > div"
     * @param {string} selector
     * @returns {CjsKeyFrame}
     */
    setSelector(selector) {
        this.selector = selector;

        return this;
    }

    /**
     * Sets the filling style of the animation
     * @param {"none"|"forwards"|"backwards"|"both"} fillMode
     * @returns {CjsKeyFrame}
     */
    setFillMode(fillMode) {
        this.fillMode = fillMode;

        return this;
    }

    /**
     *
     * @param {boolean} keepEntry
     * @returns {CjsKeyFrame}
     */
    setEndingEntryStyle(keepEntry) {
        this.keepEndingEntryStyle = keepEntry;

        return this;
    }

    /**
     *
     * @param {CjsStylePropertieses} style
     * @returns {CjsKeyFrame}
     */
    addEntry(style) {
        this.entries.push(style);

        return this;
    }

    /**
     *
     * @param {number} duration animation time in ms
     * @return {CjsKeyFrame}
     */
    setDuration(duration) {
        if(isNaN(duration)) {
            console.log(`${CJS_PRETTY_PREFIX_X} Provided argument is not a number`);
        }

        this.duration = duration;

        return this;
    }

    /**
     *
     * @param {CjsAnimationTimingFunction} timingFunction
     * @return {CjsKeyFrame}
     */
    setTimingFunction(timingFunction) {
        this.timingFunction = timingFunction;

        return this;
    }

    /**
     *
     * @param {boolean} isImportant
     * @return {CjsKeyFrame}
     */
    setImportant(isImportant) {
        this.isImportant = isImportant;

        return this;
    }

    /**
     *
     * @param {{reversed?: boolean}} options
     * @return {string}
     */
    getClass(options = { reversed: false }) {
        if(!("reversed" in options)) { options.reversed = false; }

        if(this.entries.length > 100) {
            console.log(`${CJS_PRETTY_PREFIX_X}CjsKeyFrame cannot have more than 100 entries`)
        }

        const directionDefinedEntries = ( options.reversed === true ? this.entries.slice().reverse() : this.entries );

        const entriesEachPercent = 100 / (directionDefinedEntries.length - 1);
        let parsedEntries = directionDefinedEntries.map((entry, i) => {
            const hasOneEntry = directionDefinedEntries.length === 1;
            const percent = hasOneEntry ? 100 : i * entriesEachPercent;

            return `    ${percent}% { ${Object.keys(entry).map(e => `${e}: ${entry[e]};`).join(" ")} }`
        });

        const entriesCss = `{ \n${parsedEntries.join("\n")} \n}`;
        const animationHash = getUniqueNumberId(entriesCss);
        const animationFilter = CJS_KEYFRAMES_ANIMATIONS.filter(e => e.hash === animationHash);
        const style = document.head.querySelector(`[id="${CJS_STYLE_KEYFRAMES_PREFIX}"]`);

        if(animationFilter.length === 0) {
            const animationName = `${CJS_STYLE_KEYFRAMES_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
            const css = `@keyframes ${animationName} ${entriesCss}`;

            style.innerHTML += `\n${css}`;

            const object = { hash: animationHash, animation: animationName }

            CJS_KEYFRAMES_ANIMATIONS.push(object);

            animationFilter.push(object);
        }

        const animationName = animationFilter[0].animation;
        const lastEntry = directionDefinedEntries[directionDefinedEntries.length - 1];
        const importantProperty = `${(this.isImportant ? ' !important' : '')}`;
        const lastEntryStyle = `${Object.keys(lastEntry).map(e => `${e}: ${lastEntry[e]};`).join(" ")}`;
        const cssContentParts = [
            `animation: ${animationName} ${this.duration / 1000}s ${this.timingFunction}${importantProperty}`
        ];

        if(this.keepEndingEntryStyle) {
            cssContentParts.push(lastEntryStyle);
        }

        const classCssContent = `{ ${cssContentParts.join("; ")} }`;
        const classHash = getUniqueNumberId(`${this.selector}-${classCssContent}`);

        const classFilter = CJS_KEYFRAMES_CLASSES.filter(e => e.hash === classHash);

        if(classFilter.length === 0) {
            const className = `${animationName}-${classHash}`;
            const css = `.${className} ${this.selector} ${classCssContent}`;

            style.innerHTML += `\n${css}`;

            CJS_KEYFRAMES_CLASSES.push({ hash: classHash, class: className });

            return className;
        }

        return classFilter[0].class;
    }
}