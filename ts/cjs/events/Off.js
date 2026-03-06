/**
 * Disables all events in element, where this attribute is passed
 * @param {CjsCustomEvents} event
 */
function off(...event) {
    return functionMappings.disable(event);
}