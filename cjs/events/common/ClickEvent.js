/**
 * Executes when clicked on the element
 * @param {function(CjsEvent)} f
 */
function onClick(f) {
    return functionMappings.add("click", (e, s) => f(new CjsEvent(e, s)))
}