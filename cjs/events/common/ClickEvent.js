/**
 * Executes when clicked on the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onClick(f) {
    return functionMappings.add("click", (e, s) => f(new CjsEvent(e, s)))
}