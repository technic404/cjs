/**
 * String utility functions
 */
export const CjsString = {

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