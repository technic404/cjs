
/**
 * Array.map function but also turns it to string
 * 
 * Example:
 * ```
 * <div class="row">
 *     ${strmap(data.fields, (field) => `
 *         <div class="field">${field.name}</div>
 *     `)}
 * </div>
 * ```
 * @param {[]} array 
 * @param {function(any, number)} callback 
 * @returns {string}
 */
function strmap(array, callback) {
    if(!Array.isArray(array)) {
        console.log(`${CJS_PRETTY_PREFIX_X}The provided argument in strmap is not an array`)
        return '';
    }

    return array.map(callback).join("");
}

/**
 * Helps when creating conditions in string
 * 
 * Example:
 * ```
 * <div class="row">
 *     ${strif(data.count > -1, `
 *         <div class="counter">${data.count}</div>
 *     `)}
 * </div>
 * ```
 * 
 * @param {boolean} condition 
 * @param {string} string 
 * @returns {string}
 */
function strif(condition, string) {
    return condition ? string : '';
}