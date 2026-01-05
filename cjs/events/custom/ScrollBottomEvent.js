/**
 * Executes when scrolled on the bottom of the element
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onScrollBottom(f) {
    return onLoad(cjsEvent => {
        cjsEvent.source.addEventListener("scroll", () => {
            if (cjsEvent.source.scrollTop + cjsEvent.source.clientHeight >= cjsEvent.source.scrollHeight) {
                f(cjsEvent);
            }
        });
    });
}