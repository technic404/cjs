/**
 * Executes when mouse leave the element
 * @param {function(CjsEvent)} f
 */
function onMouseleave(f) {
    return functionMappings.add("mouseleave", (e, s) => f(new CjsEvent(e, s)));
}