/**
 * Executes when mouse enter the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onMouseenter(f) {
    return functionMappings.add("mouseenter", (e, s) => f(new CjsEvent(e, s)));
}