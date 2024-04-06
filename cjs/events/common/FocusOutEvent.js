/**
 * Executes when focused out the element
 * @param {function(CjsEvent)} f
 */
function onFocusOut(f) {
    return functionMappings.add("focusout", (e, s) => f(new CjsEvent(e, s)));
}