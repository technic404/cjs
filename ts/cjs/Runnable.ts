import { CJS_PRETTY_PREFIX_X } from "./Constants";

type CjsRunnableStyle = {
    map: Map<any, any>;
};

type CjsRunnableData = {
    compiled?: boolean;
    relativePathPosition?: number;
    tempWebServerPort?: number;
    style: CjsRunnableStyle;
};

export const CjsRunnableDetails: CjsRunnableData = {
    compiled: false,
    relativePathPosition: 0,
    tempWebServerPort: 0,
    style: { map: new Map<any, any>() }
};

class CjsRunnable {
    data: CjsRunnableData | null;

    constructor() {
        this.data = null;
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
    return this.data !== null && "compiled" in this.data ? !!this.data.compiled : false;
}

    getTempWebServerPort(): number | undefined {
        if(this.data == null) return 0;

        return  this.data.tempWebServerPort;
    }

    hasStyle(): boolean {
        if(this.data == null) return false;

        return "style" in this.data && this.data.style !== undefined;
    }

    isStyleValid(): boolean {
        if(this.data == null) return false;

        return this.hasStyle() && this.data.style !== undefined && "map" in this.data.style;
    }

    validateStyle(): void {
        if(this.data == null) return;

        if (!this.data.style || !("map" in this.data.style)) {
            console.log(
                `${CJS_PRETTY_PREFIX_X}Map is not present in runnable style configuration`
            );
        }
    }

    validate(): void {
        if(this.data == null) return;

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