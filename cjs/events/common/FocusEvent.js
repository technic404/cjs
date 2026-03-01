/**
 * Executes when focused the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onFocus(f) {
    return functionMappings.add("focus", (e, s) => f(new CjsEvent(e, s)));
}