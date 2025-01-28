/**
 * It is a shortcut for accessing files in assets directory
 * 
 * In the following example image will be taken from:
 * 
 * `/src/assets/images/user.png`
 * @example
 * <img src="${asset(`images/user.png`)}" alt="user">
 * @param {string} path 
 * @returns {string}
 */
function asset(path) {
    const fixed = toFixedPath(path);

    if(!cjsRunnable.exists()) return `src/assets/${fixed}`;

    return "../".repeat(cjsRunnable.data.relativePathPosition) + `src/assets/${fixed}`;
}

/**
 * Shortcut of `asset` method, by default adds `svg/` prefix and `.svg` suffix.
 * @param {string} path 
 * @returns {string}
 */
function svg(path) {
    return asset(`svg/${path}.svg`);
}

/**
 * Shortcut of `asset` method, by default adds `images/` prefix and `.png` suffix.
 * @param {string} path 
 * @returns {string}
 */
function png(path) {
    return asset(`images/${path}.png`);
}

/**
 * Shortcut of `asset` method, by default adds `images/` prefix and `.jpg` suffix.
 * @param {string} path 
 * @returns {string}
 */
function jpg(path) {
    return asset(`images/${path}.jpg`);
}