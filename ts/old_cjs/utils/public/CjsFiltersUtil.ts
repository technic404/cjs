import { CJS_STYLE_FILTERS_PREFIX } from "../../Constants";
import { getRandomCharacters } from "../StringUtil";
import { CjsTimings } from "./CjsTimingsUtil";

export type CjsFilterTypes =
    | "grayscale"
    | "blur"
    | "brightness"
    | "contrast"
    | "hue-rotate"
    | "invert"
    | "opacity"
    | "saturate"
    | "sepia";

export type CjsFilterDirections = "standard" | "reverse";

export interface CjsFilterOptions {
    filter: CjsFilterTypes;
    amount?: number;
    direction?: CjsFilterDirections;
    time?: number;
}

export class CjsFilter {
    constructor(
        private name: CjsFilterTypes,
        private amount: number,
        private direction: CjsFilterDirections,
        private time: number,
        private className: string
    ) {}

    getClassName(): string {
        return this.className;
    }
}

function buildFilterAnimation(
    filterName: CjsFilterTypes,
    amount: number,
    direction: CjsFilterDirections,
    timeMs: number
): CjsFilter {
    const style = document.head.querySelector<HTMLStyleElement>(
        `[id="${CJS_STYLE_FILTERS_PREFIX}"]`
    );

    if (!style) {
        throw new Error("Filter style element not found");
    }

    let from = "";
    let to = "";

    switch (filterName) {

        case "grayscale":
            from = `grayscale(0)`;
            to = `grayscale(${amount})`;
            break;

        case "blur":
            from = `blur(0px)`;
            to = `blur(${amount}px)`;
            break;

        case "brightness":
            from = `brightness(0%)`;
            to = `brightness(${amount}%)`;
            break;

        case "contrast":
            from = `contrast(0%)`;
            to = `contrast(${amount}%)`;
            break;

        case "hue-rotate":
            from = `hue-rotate(0deg)`;
            to = `hue-rotate(${amount}deg)`;
            break;

        case "invert":
            from = `invert(0%)`;
            to = `invert(${amount}%)`;
            break;

        case "opacity":
            from = `opacity(0)`;
            to = `opacity(${amount})`;
            break;

        case "saturate":
            from = `saturate(0%)`;
            to = `saturate(${amount}%)`;
            break;

        case "sepia":
            from = `sepia(0%)`;
            to = `sepia(${amount}%)`;
            break;
    }

    // Reverse animation if needed
    if (direction === "reverse") {
        [from, to] = [to, from];
    }

    const className = `${CJS_STYLE_FILTERS_PREFIX}${filterName}-${getRandomCharacters(8)}`;
    const animationName = getRandomCharacters(32);

    const css = `
.${className} {
    filter: ${to};
    animation: ${animationName} ${timeMs / 1000}s;
}

@keyframes ${animationName} {
    0% { filter: ${from}; }
    100% { filter: ${to}; }
}
`;

    style.innerHTML += css;

    return new CjsFilter(
        filterName,
        amount,
        direction,
        timeMs,
        className
    );
}

/* ========================================================= */
/* Active Filters Cache                                       */
/* ========================================================= */

const ACTIVE_FILTERS: Record<CjsFilterTypes, CjsFilter[]> = {
    blur: [],
    opacity: [],
    grayscale: [],
    brightness: [],
    contrast: [],
    "hue-rotate": [],
    invert: [],
    saturate: [],
    sepia: []
};

async function passFilterToElement(
    el: HTMLElement,
    name: CjsFilterTypes,
    amount: number = 10,
    direction: CjsFilterDirections = "standard",
    time: number = 500
): Promise<void> {
    const existing = ACTIVE_FILTERS[name].find(f =>
        f["amount"] === amount &&
        f["direction"] === direction &&
        f["time"] === time
    );

    const filter = existing ?? buildFilterAnimation(name, amount, direction, time);

    if (!existing) {
        ACTIVE_FILTERS[name].push(filter);
    }

    // Remove old filters of same type
    ACTIVE_FILTERS[name].forEach(f => {
        el.classList.remove(f.getClassName());
    });

    el.classList.add(filter.getClassName());

    await CjsTimings.sleep(time);

    el.classList.remove(filter.getClassName());
}

export async function createFilter(
    element: HTMLElement,
    options: CjsFilterOptions
): Promise<void> {
    const finalOptions: Required<CjsFilterOptions> = {
        filter: options.filter,
        amount: options.amount ?? 10,
        direction: options.direction ?? "standard",
        time: options.time ?? 500
    };

    await passFilterToElement(
        element,
        finalOptions.filter,
        finalOptions.amount,
        finalOptions.direction,
        finalOptions.time
    );
}