/**
 * Merges two objects into one, by default object2 overwites values of object1
 * @param {object} object1 
 * @param {object} object2 
 * @param {boolean} overwrite if overwrite values using object2
 * @returns {object}
 */
function joinObjects(object1, object2, overwrite = true) {
    if (typeof object1 !== 'object' || typeof object2 !== 'object') {
        return object1 || object2;
    }

    const result = {};

    for (let key in object1) {
        result[key] = joinObjects(object1[key], object2[key], overwrite);
    }

    for (let key in object2) {
        if (overwrite && result.hasOwnProperty(key)) continue;
        result[key] = object2[key];
    }

    return result;
}