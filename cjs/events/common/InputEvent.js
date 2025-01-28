/**
 * Executes when typed in the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onInput(f) {
    return functionMappings.add("input", (e, s) => f(new CjsEvent(e, s)))
}