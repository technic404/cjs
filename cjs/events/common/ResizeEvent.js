/**
 * Executes when window is being resized
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onResize(f) {
    return functionMappings.add(
        "resize",
        (e, s) => f(new CjsEvent(e, s)),
        { windowApplied: true })
}