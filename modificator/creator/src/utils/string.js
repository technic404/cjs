/**
 * 
 * @param {string} str 
 * @param {boolean} isCapitalized 
 * @returns {string}
 */
function changeFirstLetterCapitalization(str, isCapitalized = false) {
    if (str.length === 0) {
        return str;
    }
    return (isCapitalized ? str[0].toUpperCase() : str[0].toLowerCase()) + str.slice(1);
}

module.exports = {
    changeFirstLetterCapitalization
}