/**
 * Executes when element is being loaded into website
 * @param {(cjsEvent: CjsEvent) => any} f
 * @returns {string}
 */
function onLoad(f) {
    return mutationListener.listen("add", f);
}