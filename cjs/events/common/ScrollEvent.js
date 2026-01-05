/**
 * Executes when scrolled in the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onScroll(f) {
    return functionMappings.add("scroll", (e, s) => f(new CjsEvent(e, s)));
}