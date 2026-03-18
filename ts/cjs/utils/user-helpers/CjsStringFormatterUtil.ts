import { CJS_PRETTY_PREFIX_X } from "../../Constants";

/**
 * Array.map but returns string (useful for templates)
 */
export function strmap<T>(
    array: T[],
    callback: (element: T, index: number) => string
): string {
    if (!Array.isArray(array)) {
        console.log(
            `${CJS_PRETTY_PREFIX_X}The provided argument in strmap is not an array`,
            array
        );
        return "";
    }

    return array.map(callback).join("");
}


/**
 * Conditional string helper
 */
export function strif(condition: boolean, value: string): string {
    return condition ? value : "";
}


/**
 * Truncates string and adds "..." if it exceeds max length
 */
export function strmax(value: string, max: number): string {
    const SUFFIX = "...";

    if (!value) return value;

    if (value.length <= max) return value;

    const availableLength = max - SUFFIX.length;

    if (availableLength <= 0) {
        return SUFFIX;
    }

    return value.substring(0, availableLength) + SUFFIX;
}


/**
 * Returns fallback if string is empty / null / undefined
 */
export function stror(value: string | null | undefined, fallback: string): string {
    return value == null || value.trim() === ""
        ? fallback
        : value;
}