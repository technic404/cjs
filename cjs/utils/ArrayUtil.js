/**
 * Converts multidimensional array to single dimension array
 * @param {Array} arr 
 * @returns {Array}
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
