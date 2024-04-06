/**
 * Executes when hold down in touch or click on specific element
 * @param {function(CjsEvent)} f
 * @param {number} time time of hold down in ms
 * @returns {string}
 */
function onHoldDown(f, time = 500) {
    return onLoad(cjsEvent => {
        let timeout;

        const cancel = () => { clearTimeout(timeout); }
        const down = () => {
            timeout = setTimeout(() => {
                f(cjsEvent);
            }, time);
        }

        cjsEvent.source.addEventListener('mousedown', down);
        cjsEvent.source.addEventListener('touchstart', down);

        cjsEvent.source.addEventListener('mouseup', cancel);
        cjsEvent.source.addEventListener('mousemove', cancel);
        cjsEvent.source.addEventListener('touchend', cancel);
        cjsEvent.source.addEventListener('touchcancel', cancel);
        cjsEvent.source.addEventListener('touchmove', cancel);
    })
}