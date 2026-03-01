/**
 * Executes when double-clicked on the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onDblclick(f) {
    return functionMappings.add("dblclick", (e, s) => f(new CjsEvent(e, s)));
}