/**
 * Executes when double-clicked on the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onDblclick(f) {
    return functionMappings.add("dblclick", (e, s) => f(new CjsEvent(e, s)));
}