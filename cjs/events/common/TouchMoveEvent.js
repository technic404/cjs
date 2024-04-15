/**
 * Executes when move-touched the element
 * @param {function(CjsEvent)} f
 */
function onTouchMove(f) {
    return functionMappings.add("touchmove", (e, s) => f(new CjsEvent(e, s)));
}