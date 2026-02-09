
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
        console.log(`${CJS_PRETTY_PREFIX_X}The provided argument in strmap is not an array, it's `, array)
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

/**
 * If string is too long (limited by max param) then the string will be cut and the `"..."` suffix will be added.
 * 
 * Example:
 * ```
 * <div class="row">
 *     ${strmax(data.message, 10)}
 * </div>
 * ```
 * 
 * Will provide full message if the `data.message` does not exceed the characters length of `10`.
 * Else will provide `data.message` sliced like `"Hello w..."`.
 * 
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
function strmax(str, max) {
    const SUFFIX = "...";

    if(str.length > max) {
        const exceededLimitBy = str.length - max;
        const extraSuffixCutRaw = SUFFIX.length - exceededLimitBy;
        const extraSuffixCut = extraSuffixCutRaw > SUFFIX.length ? SUFFIX.length : extraSuffixCutRaw;

        return str.substring(0, max + extraSuffixCut) + SUFFIX;
    }

    return str;
}

/**
 * If string (str) is empty the function will provide the or argument
 * 
 * Example:
 * ```
 * <div class="row">
 *     ${stror(data.source, "N/A")}
 * </div>
 * ```
 * 
 * Will provide full message if the `data.source` exists (the text is not empty).
 * Else will provide second argument - in this case "N/A".
 * 
 * @param {string} str
 * @param {string} or
 * @returns {string}
 */
function stror(str, or) {
    return str === null || str.trim() === "" ? or : str;
}