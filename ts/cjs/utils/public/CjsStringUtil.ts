
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
    }
};