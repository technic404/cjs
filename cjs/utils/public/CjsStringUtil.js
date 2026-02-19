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
     * @returns {string}
     */
    capitalize(str) {
        if (str.length === 0) return str;
        
        return str[0].toUpperCase() + str.slice(1);
    }
};