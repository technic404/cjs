/**
 * Executes when clicked outside the element
 * @param {function(CjsEvent)} f
 */
function onOuterclick(f) {
    return functionMappings.add("click", (event, source) => {
        if (!document.body.contains(source)) return;

        if (source !== event.target && !source.contains(event.target)) {
            // f(f, event, source);
        }
        
        f(new CjsEvent(e, s));
    }, { windowApplied: true, additionalName: 'outerclick' });
}