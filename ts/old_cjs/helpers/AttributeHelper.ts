import { CJS_ID_LENGTH } from "../Constants";
import { getRandomCharacters } from "../utils/StringUtil";

export const AttributeHelper = {
    /**
     * Generates attribute
     * @param prefix 
     * @param exclude 
     * @returns 
     */
    generateAttribute(prefix: string, exclude: any[]): string {
        let attribute: string | null = null;

        /**
         * Determinates if do next iteration for searching non duplicated attribute
         */
        const next = (): boolean => {
            const doesNotHaveAttribute = attribute === null;
            const attributeIsTaken = exclude.includes(attribute);

            return doesNotHaveAttribute || attributeIsTaken;
        }

        while (next()) {
            attribute = `${prefix}${getRandomCharacters(CJS_ID_LENGTH)}`;
        }

        return attribute as string;
    }
}