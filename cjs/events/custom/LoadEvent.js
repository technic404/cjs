/**
 * Executes when element is being loaded into website
 * @param {function(CjsEvent)} f
 * @returns {string}
 */
function onLoad(f) {
    return mutationListener.listen("add", f);
}