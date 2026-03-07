import { CJS_PRETTY_PREFIX_X } from "./Constants";

type CjsRunnableStyle = {
    map: Map<any, any>;
};

type CjsRunnableData = {
    compiled?: boolean;
    relativePathPosition?: number;
    tempWebServerPort?: number;
    style?: CjsRunnableStyle;
};

declare const CjsRunnableDetails: CjsRunnableData | undefined;

class CjsRunnable {
    data: CjsRunnableData;

    constructor() {
        this.data = {};
    }

    /**
     * If runnable variable is present
     */
    exists(): boolean {
        return typeof CjsRunnableDetails !== "undefined";
    }

    import(): void {
        if (!this.exists()) return;

        this.data = CjsRunnableDetails!;
    }

    isCompiled(): boolean {
        return "compiled" in this.data && !!this.data.compiled;
    }

    getTempWebServerPort(): number | undefined {
        return this.data.tempWebServerPort;
    }

    hasStyle(): boolean {
        return "style" in this.data && this.data.style !== undefined;
    }

    isStyleValid(): boolean {
        return this.hasStyle() && this.data.style !== undefined && "map" in this.data.style;
    }

    validateStyle(): void {
        if (!this.data.style || !("map" in this.data.style)) {
            console.log(
                `${CJS_PRETTY_PREFIX_X}Map is not present in runnable style configuration`
            );
        }
    }

    validate(): void {
        if (this.hasStyle()) {
            this.validateStyle();

            if (this.data.style && "map" in this.data.style) {
                console.log(`${CJS_PRETTY_PREFIX_X}Please note that style compiler does not support import options: prefixStyleRules, encodeKeyframes, enableMultiSelector`);
            }
        }
    }
}

export const cjsRunnable = new CjsRunnable();

cjsRunnable.import();
cjsRunnable.validate();