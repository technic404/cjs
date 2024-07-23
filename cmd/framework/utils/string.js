/**
 * Capitalizes first letter of the string
 * @param {string} str 
 * @param {boolean} isCapitalized 
 * @returns {string}
 */
function capitalizeFirst(str, isCapitalized = false) {
    if (str.length === 0) return str;
    
    return (isCapitalized ? str[0].toUpperCase() : str[0].toLowerCase()) + str.slice(1);
}

/**
 * Checks if char is upper case
 * @param {string} char 
 * @returns {boolean}
 */
function isUpperCase(char) {
    return char === char.toUpperCase();
}

/**
 * Returns indexes of the uppercase letters
 * @param {string} str 
 * @returns {string[]}
 */
function getUpperCaseIndexes(str) {
    const indexes = [];
    
    for(let i = 0; i < str.length; i++) {
        const char = str[i];

        if(isUpperCase(char)) {
            indexes.push(i);
        }
    }

    return indexes;
}

/**
 * Inserts string to a string at index
 * @param {string} str 
 * @param {number} index 
 * @param {string} value 
 * @returns {string}
 */
function insertString(str, index, value) {
    return str.substring(0, index) + value + str.substring(index);
}

module.exports = {
    capitalizeFirst,
    isUpperCase,
    getUpperCaseIndexes,
    insertString
}