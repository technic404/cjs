

export const _CSSRangeRule = {
   processSelector(selector: string) {
        const parts = selector.split(" ");
        const determiner = parts[1];
        const value = parts[2];
        const mapping: Record<string, string> = {};
        const valueParts = (() => {
            let number = "";
            let unit = "";

            for (const char of value.split("")) {
                if (isNaN(Number(char))) unit += char;
                else number += char;
            }

            return { number: parseInt(number), unit };
        })();

        const { number, unit } = valueParts;

        mapping["<"] = `max-width: ${number - 1}${unit}`;
        mapping["<="] = `max-width: ${number}${unit}`;
        mapping[">"] = `min-width: ${number + 1}${unit}`;
        mapping[">="] = `min-width: ${number}${unit}`;

        return `@media only screen and (${
            mapping[determiner]
        })`
    }
}