/**
 * Merges two objects
 * @param {object} defaultObject this object will be cloned
 * @param {object} overwriteObject thiw object will overwrite the defaults if the keys are present
 * @returns {object}
 */
function mergeObjects(defaultObject, overwriteObject) {
    // Deep clone the default configuration to avoid modifying it directly
    const object = JSON.parse(JSON.stringify(defaultObject));

    /**
     * Recursive function to merge objects
     * @param {object} obj1 object that will be changed to merged object
     * @param {object} obj2 object that will be overwriting data to obj1
     */
    function mergeObjects(obj1, obj2) {
        for (const key in obj2) {
            if(!obj2.hasOwnProperty(key)) continue;

            if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
                // If both are objects, merge them recursively
                mergeObjects(obj1[key], obj2[key]);
            } else {
                // Otherwise, overwrite the value from user settings
                obj1[key] = obj2[key];
            }
        }
    }

    // Start merging from the top-level properties
    mergeObjects(object, overwriteObject);

    return object;
}

module.exports = {
    mergeObjects
}