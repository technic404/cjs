
/**
 * Executes when clicked ESC (Escape) keyboard key
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onEscape(f) {
    return onLoad(cjsEvent => {
        document.addEventListener('keydown', (event) => {
            const isEscape = event.key === "Escape" || event.key == "Esc";

            if(isEscape) f(cjsEvent);
        });
    });
}