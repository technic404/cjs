/**
 *
 * @param {CjsCustomEvents} event
 */
function off(...event) {
    return functionMappings.disable(event);
}