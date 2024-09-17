/**
 * Generates attribute
 * @param {string} prefix 
 * @param {[]} exclude 
 * @returns {string}
 */
Cjs.generateAttribute = (prefix, exclude) => {
    let attribute = null;

    /**
     * Determinates if do next iteration for searching non duplicated attribute
     * @returns {boolean} 
     */
    const next = () => {
        const doesNotHaveAttribute = attribute === null;
        const attributeIsTaken = exclude.includes(attribute);

        return doesNotHaveAttribute || attributeIsTaken;
    }

    while (next()) {
        attribute = `${prefix}${getRandomCharacters(CJS_ID_LENGTH)}`;
    }

    return attribute;
}