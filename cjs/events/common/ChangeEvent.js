/**
 * Executes when changed the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onChange(f) {
    return functionMappings.add("change", (e, s) => f(new CjsEvent(e, s)));
}