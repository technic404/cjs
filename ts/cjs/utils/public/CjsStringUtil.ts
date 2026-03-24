
const RandomCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SafeRandomCharacters = "abcdefghijklmnopqrstuvwxyz0123456789"

export const CjsStringUtil = {
    getRandom(length: number, safeCharacters: boolean = true): string {
        let result = "";

        const characters = safeCharacters
            ? SafeRandomCharacters
            : RandomCharacters;
        const charactersLength = characters.length;

        let counter = 0;

        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        if(safeCharacters) {
            const isFirstCharacterANumber = (string: string): boolean => {
                return !isNaN(Number(string.substring(0, 1)));
            };

            while (isFirstCharacterANumber(result)) {
                result = this.getRandom(length, safeCharacters);
            }
        }

        return result;
    },
    /**
     * Creates a unique numeric ID from a string
     * (DJB2 hash)
     */
    getHash(string: string): number {

        let hash = 5381;

        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            hash = (hash * 33) ^ char;
        }

        return hash >>> 0; // force positive integer
    },
    /**
     * Remove HTML tags from the input, keeping inner content
     */
    removeHtmlTags(input: string): string {
        return input.replace(/<[^>]*>/g, "");
    },
    /**
     * Capitalizes first letter of the string
     */
    capitalize(value: string): string {
        if (!value) return value;

        return value.charAt(0).toUpperCase() + value.slice(1);
    }
};