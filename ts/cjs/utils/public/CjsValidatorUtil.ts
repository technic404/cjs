/**
 * Validation utility
 */
export const CjsValidator = {

    /**
     * Checks if provided string is a valid email
     */
    isEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

};