/**
 * Executes when mouse moves on the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onMouseMove(f) {
    return functionMappings.add("mousemove", (e, s) => f(new CjsEvent(e, s)));
}