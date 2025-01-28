/**
 * Variable that stores global settings for website
 * @type {CjsGlobalsOptions}
 */
const CjsGlobals = {
    mouse: {
        up: true,
        down: false,
        state: "up"
    },
    window: {
        DOMContentLoaded: false
    }
};

/* Mouse */
window.addEventListener('mousedown', () => { CjsGlobals.mouse = { up: false, down: true, state: "down" } });
window.addEventListener('mouseup', () => { CjsGlobals.mouse = { up: true, down: false, state: "up" } });
window.addEventListener('DOMContentLoaded', () => { CjsGlobals.window.DOMContentLoaded = true; });