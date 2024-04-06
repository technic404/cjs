/**
 * Executes when element is being loaded into website
 * @param {function(CjsEvent)} f
 */
function onLoad(f) {
    return changesObserver.listen("add", f);
}