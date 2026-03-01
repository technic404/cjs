/**
 * Executes when mouse enter the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onMouseenter(f) {
    return functionMappings.add("mouseenter", (e, s) => f(new CjsEvent(e, s)));
}