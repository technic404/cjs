/**
 * Extecutes when slided by touch of mouse drag up by certain threshold
 * @param {function(CjsEvent)} f
 * @param {number} slideThreshold
 * @returns {string}
 */
function onSlideUp(f, slideThreshold = 10) {
    return onLoad((cjsEvent) => {
        let startY;
        let lastClientY = null;

        const start = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);

            lastClientY = clientY;
            startY = clientY;
        }

        const move = (e) => {
            const clientY = (!("touches" in e) ? e.clientY : e.touches[0].clientY);
            const moveProgressed = clientY - 1 <= lastClientY;
            const deltaY = clientY - startY;

            if(!moveProgressed) {
                startY = undefined;
                return;
            }

            if(deltaY < -1 *  slideThreshold) {
                f(cjsEvent)

                startY = undefined;
            }

            lastClientY = clientY;
        }

        cjsEvent.source.addEventListener('mousedown', start)
        cjsEvent.source.addEventListener('touchstart', start)

        cjsEvent.source.addEventListener('mousemove', move);
        cjsEvent.source.addEventListener('touchmove', move);
    });
}