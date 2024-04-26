/**
 * Converts multidimensional array to single dimension array
 * @param {[]} arr 
 * @returns {[]}
 */
function flattenInfinite(arr) {
    return arr.reduce((acc, current) => {
        if (Array.isArray(current)) {
            return acc.concat(flattenInfinite(current));
        } else {
            return acc.concat(current);
        }
    }, []);
}

/**
 * Returns random array element
 * @param {[]} array 
 * @returns {any}
 */
function getRandomArrayElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}