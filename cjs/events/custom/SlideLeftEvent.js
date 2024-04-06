/**
 * Extecutes when slided by touch of mouse drag to left by certain threshold
 * @param {function(CjsEvent)} f
 * @param {number} slideThreshold triggers event when user slides by that amount of pixels
 * @param {number} cancelUpDownThreshold cancels event when user slides down or up too much (if disable just set -1)
 * @returns {string}
 */
function onSlideLeft(f, slideThreshold = 50, cancelUpDownThreshold = 50) {
    return onLoad((cjsEvent) => {
        let mouse = { startX: null, startY: null, lastX: null, lastY: null }

        const start = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            mouse.lastX = clientX;
            mouse.startX = clientX;
            mouse.lastY = clientY;
            mouse.startY = clientY;
        }

        const move = (e) => {
            const clientX = (!("touches" in e) ? e.clientX : e.touches[0].clientX);
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientX - 1 <= mouse.lastX;
            const deltaX = clientX - mouse.startX;
            const deltaY = clientY - mouse.startY;

            if(cancelUpDownThreshold !== -1 && cancelUpDownThreshold < Math.abs(deltaY)) {
                mouse.startX = undefined;
                return;
            }

            if(!moveProgressed) {
                mouse.startX = undefined;
                return;
            }

            if(deltaX < -1 * slideThreshold) {
                f(cjsEvent)

                mouse.startX = undefined;
            }

            mouse.lastX = clientX;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}