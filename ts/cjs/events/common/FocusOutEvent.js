/**
 * Executes when focused out the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onFocusOut(f) {
    return functionMappings.add("focusout", (e, s) => f(new CjsEvent(e, s)));
}