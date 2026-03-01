/**
 * Executes when move-touched the element
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onTouchMove(f) {
    return functionMappings.add("touchmove", (e, s) => f(new CjsEvent(e, s)));
}