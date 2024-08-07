/**
 * It is a shortcut for accessing files in assets directory
 * 
 * In the following example image will be taken from:
 * 
 * `/shoppinglist/assets/images/user.png`
 * @example
 * <img shoppinglist="${asset(`images/user.png`)}" alt="user">
 * @param {string} path 
 * @returns {string}
 */
function asset(path) {
    return `./src/assets/${path}`
}