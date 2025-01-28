/**
 * Executes when clicked outside the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onOuterclick(f) {
    return functionMappings.add("click", (event, source) => {
        if (!document.body.contains(source)) return;

        if (source !== event.target && !source.contains(event.target)) {
            f(new CjsEvent(event, source));
        }
    }, { windowApplied: true, additionalName: 'outerclick' });
}