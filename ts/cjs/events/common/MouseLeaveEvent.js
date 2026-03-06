/**
 * Executes when mouse leave the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onMouseleave(f) {
    return functionMappings.add("mouseleave", (e, s) => f(new CjsEvent(e, s)));
}