const CjsString = {
    /**
     * Remove Html tags from the input, keeping the inner Html content
     * @param {string} input 
     * @returns {string}
     */
    removeHtmlTags: function(input) {
        return input.replace(/<[^>]*>/g, '');
    }
};