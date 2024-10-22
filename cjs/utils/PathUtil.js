/**
 * Returns parsed path that does not start with `./` and `/`
 * @param {string} path 
 * @returns {string}
 */
function toFixedPath(path) {
    if(path.startsWith("./")) return path.slice(2);

    if(path.startsWith("/")) return path.slice(1);

    return path;
}