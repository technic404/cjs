/**
 * Generates random characters (lowercase, HTML-friendly)
 */
export function getRandomCharacters(length: number): string {

    let result = "";

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".toLowerCase();
    const charactersLength = characters.length;

    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    const isFirstCharacterANumber = (string: string): boolean => {
        return !isNaN(Number(string.substring(0, 1)));
    };

    while (isFirstCharacterANumber(result)) {
        result = getRandomCharacters(length);
    }

    return result;
}


/**
 * Creates a unique numeric ID from a string
 * (DJB2 hash)
 */
export function getUniqueNumberId(string: string): number {

    let hash = 5381;

    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash * 33) ^ char;
    }

    return hash >>> 0; // force positive integer
}


/**
 * Safe replaceAll implementation (for older JS environments)
 */
export function safeReplaceAll(
    string: string,
    search: string,
    value: string
): string {

    return string.replace(new RegExp(`${search}`, "g"), value);
}