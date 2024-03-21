const CjsValidator = {
    /**
     * Checks if provided valid email
     * @param {string} string 
     * @returns {boolean}
     */
    isEmail(string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string);
    }
}