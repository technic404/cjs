/**
 * Creates a handle function, used for autocomplete when using CjsEvent
 * @example
 * 
 * ```js
 * const handleLoad = createHandle((e) => {
 *     console.log('Element just loaded', e.source)
 * });
 * ```
 * 
 * @param {function(CjsEvent)} func
 * @returns {function}
 */
function createHandle(func) {
    return func;
}