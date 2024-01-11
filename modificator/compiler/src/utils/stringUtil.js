/**
 * To lower case (html naming friendly)
 * @param {Number} length
 * @returns {String}
 */
function getRandomCharacters(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'; // lower case is html naming friendly
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
 * @param {String} content 
 * @returns {String}
 */
function removeTooManyNewLines(content) {
    const lines = content.split('\n');
    let cleanedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1];
        
        if (line.trim() !== '' || (nextLine && nextLine.trim() !== '')) {
            cleanedLines.push(line);
        }
    }
    
    const resultStr = cleanedLines.join('\n');
    return resultStr;
}

/**
 *
 * @param {String} originalString
 * @param {Number} startIndex
 * @param {Number} endIndex
 * @returns {String}
*/
function cutOffTextFromString(originalString, startIndex, endIndex) {
    if (
        startIndex < 0 ||
        endIndex > originalString.length ||
        startIndex > endIndex
    ) {
        console.error("Invalid index values");
        return originalString;
    }

    return (
        originalString.substring(0, startIndex) +
        originalString.substring(endIndex)
    );
}

/**
 *
 * @param {String} content
 * @param {Number} index
 * @param {String} text
 * @returns {String}
 */
function insertTextAtIndex(content, index, text) {
    return content.slice(0, index) + text + content.slice(index);
}

module.exports = {
    getRandomCharacters,
    removeTooManyNewLines,
    cutOffTextFromString,
    insertTextAtIndex,
    getRandomCharacters
}