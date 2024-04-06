/**
 * Executes when focused the element
 * @param {function(CjsEvent)} f
 */
function onFocus(f) {
    return functionMappings.add("focus", (e, s) => f(new CjsEvent(e, s)));
}