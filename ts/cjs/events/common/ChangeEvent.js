/**
 * Executes when changed the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onChange(f) {
    return functionMappings.add("change", (e, s) => f(new CjsEvent(e, s)));
}