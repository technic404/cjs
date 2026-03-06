/**
 * Executes when typed in the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onInput(f) {
    return functionMappings.add("input", (e, s) => f(new CjsEvent(e, s)))
}