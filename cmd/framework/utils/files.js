

/**
 * @example
 * ./users -> users
 * /user -> users
 * @param {string} path 
 * @returns 
 */
function normalizePath(path) {
    if(path.startsWith("./")) return path.slice(2);
    if(path.startsWith("/")) return path.slice(1);

    return path;
}

module.exports = {
    normalizePath
}