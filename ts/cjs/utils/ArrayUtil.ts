/**
 * Converts multidimensional array to single dimension array
 */
export function flattenInfinite<T>(arr: T[]): T[] {
    return arr.reduce<T[]>((acc, current) => {

        if (Array.isArray(current)) {
            // TypeScript sees `current` as T | T[]
            // We safely cast when recursing
            return acc.concat(flattenInfinite(current as unknown as T[]));
        }

        return acc.concat(current);

    }, []);
}


/**
 * Returns random array element
 */
export function getRandomArrayElement<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
}