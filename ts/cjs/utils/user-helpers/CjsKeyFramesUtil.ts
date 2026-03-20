import { CjsGlobalStyleKeyframesTagId, CjsGlobalStyleTagId } from "../../constants";
import { _CjsLoggerUtil } from "../protected/_CjsLoggerUtil";
import { CjsStringUtil } from "../public/CjsStringUtil";

/**
 * Global animation caches
 */
const CJS_KEYFRAMES_ANIMATIONS: {
    hash: number;
    animation: string;
}[] = [];

const CJS_KEYFRAMES_CLASSES: {
    hash: number;
    class: string;
}[] = [];

/**
 * Timing function type
 */
export type CjsAnimationTimingFunction =
    | "linear"
    | "ease"
    | "ease-in"
    | "ease-out"
    | "ease-in-out"
    | string;

/**
 * Style object for keyframe entry
 */
export type CjsStyleProperties = Record<string, string | number>;

export class CjsKeyFrame<T extends CjsStyleProperties = CjsStyleProperties> {

    private entries: T[] = [];
    private duration = 1000;
    private timingFunction: CjsAnimationTimingFunction = "ease";
    private keepEndingEntryStyle = true;
    private selector = "";
    private isImportant = false;
    private fillMode: "none" | "forwards" | "backwards" | "both" | "" = "";

    // --------------------------------------------------
    // Configuration
    // --------------------------------------------------

    setSelector(selector: string): this {
        this.selector = selector;
        return this;
    }

    setFillMode(fillMode: "none" | "forwards" | "backwards" | "both"): this {
        this.fillMode = fillMode;
        return this;
    }

    setEndingEntryStyle(keepEntry: boolean): this {
        this.keepEndingEntryStyle = keepEntry;
        return this;
    }

    addEntry(style: T): this {
        this.entries.push(style);
        return this;
    }

    setDuration(duration: number): this {
        if (isNaN(duration)) {
            _CjsLoggerUtil.error("Provided argument is not a number");
            return this;
        }

        this.duration = duration;
        return this;
    }

    setTimingFunction(fn: CjsAnimationTimingFunction): this {
        this.timingFunction = fn;
        return this;
    }

    setImportant(flag: boolean): this {
        this.isImportant = flag;
        return this;
    }

    // --------------------------------------------------
    // Core Logic
    // --------------------------------------------------

    getClass(options: { reversed?: boolean } = {}): string {
        const reversed = options.reversed ?? false;

        if (this.entries.length > 100) {
            _CjsLoggerUtil.error("CjsKeyFrame cannot have more than 100 entries");
        }

        const styleElement = document.head.querySelector<HTMLStyleElement>(
            `[id="${CjsGlobalStyleTagId}"]`
        );

        if (!styleElement) {
            throw new Error("Keyframes style element not found");
        }

        const entries = reversed
            ? [...this.entries].reverse()
            : this.entries;

        const hasOneEntry = entries.length === 1;
        const stepPercent = 100 / Math.max(entries.length - 1, 1);
        const cssKeyframes = entries.map((entry, i) => {
            const percent = hasOneEntry ? 100 : i * stepPercent;
            const styles = Object.entries(entry)
                .map(([key, value]) => `${key}: ${value};`)
                .join(" ");

            return `    ${percent}% { ${styles} }`;

        }).join("\n");

        const keyframeBlock = `{\n${cssKeyframes}\n}`;
        const animationHash = CjsStringUtil.getHash(keyframeBlock);
        const existing = CJS_KEYFRAMES_ANIMATIONS.find(e => e.hash === animationHash);

        let animationName: string;

        if (!existing) {
            animationName = `${CjsGlobalStyleKeyframesTagId}${CjsStringUtil.getRandom(16)}`;

            const css = `@keyframes ${animationName} ${keyframeBlock}`;

            styleElement.innerHTML += `\n${css}`;

            CJS_KEYFRAMES_ANIMATIONS.push({
                hash: animationHash,
                animation: animationName
            });

        } else {
            animationName = existing.animation;
        }

        // --------------------------------------------------
        // Generate CSS Class
        // --------------------------------------------------

        const lastEntry = entries[entries.length - 1];
        const important = this.isImportant ? " !important" : "";
        const lastEntryStyles = Object.entries(lastEntry)
            .map(([key, value]) => `${key}: ${value};`)
            .join(" ");

        const animationRule =
            `animation: ${animationName} ${this.duration / 1000}s ${this.timingFunction}${important}`;
        const classCssParts = [animationRule];

        if (this.keepEndingEntryStyle) {
            classCssParts.push(lastEntryStyles);
        }

        const classBlock = `{ ${classCssParts.join("; ")} }`;
        const classHash = CjsStringUtil.getHash(`${this.selector}-${classBlock}`);
        const existingClass = CJS_KEYFRAMES_CLASSES.find(e => e.hash === classHash);

        if (existingClass) {
            return existingClass.class;
        }

        const className = `${animationName}-${classHash}`;

        const css = `.${className} ${this.selector} ${classBlock}`;

        styleElement.innerHTML += `\n${css}`;

        CJS_KEYFRAMES_CLASSES.push({
            hash: classHash,
            class: className
        });

        return className;
    }
}