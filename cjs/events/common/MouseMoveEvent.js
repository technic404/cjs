/**
 * Executes when mouse moves on the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onMouseMove(f) {
    return functionMappings.add("mousemove", (e, s) => f(new CjsEvent(e, s)));
}