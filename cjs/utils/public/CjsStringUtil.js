const CjsString = {
    /**
     * Remove Html tags from the input, keeping the inner Html content
     * @param {string} input 
     * @returns {string}
     */
    removeHtmlTags: function(input) {
        return input.replace(/<[^>]*>/g, '');
    },
    /**
     * Capitalizes first letter of the string
     * @param {string} str 
     * @param {boolean} isCapitalized 
     * @returns {string}
     */
    capitalizeFirst(str, isCapitalized = false) {
        if (str.length === 0) return str;
        
        return (isCapitalized ? str[0].toUpperCase() : str[0].toLowerCase()) + str.slice(1);
    }
};