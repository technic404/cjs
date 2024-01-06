/**
 * To lower case (html naming friendly)
 * @param {Number} length
 * @returns {String}
 */
function getRandomCharacters(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.toLowerCase(); // lower case is html naming friendly
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    /**
     *
     * @param {String} string
     * @return {boolean}
     */
    const isFirstCharacterANumber = (string) => { return !isNaN(string.substring(0, 1)); }

    while (isFirstCharacterANumber(result)) {
        result = getRandomCharacters(length);
    }

    return result;
}

/**
 *
 * @param {String} string
 * @return {Number}
 */
function getUniqueNumberId(string) {
    let hash = 5381; // Initial hash value

    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash * 33) ^ char; // DJB2 hash function
    }

    return hash >>> 0; // Ensure the result is a positive integer
}

/**
 *
 * @param {String} string source string
 * @param {String} search
 * @param {String} value
 * @return {String}
 */
function safeReplaceAll(string, search, value) {
    return string.replace(new RegExp(`${search}`, 'g'), `${value}`)
}