const CjsObject = {
    /**
     * Returns values from the keys if the value is not an object
     * @param {object} object 
     * @returns {[]}
     */
    getNonObjectValues: function(object) {
        /**
         * @param {ObjectConstructor} subObject 
         * @returns {[]}
         */
        const traverse = (subObject) => {
            const values = [];
            const keys = Object.keys(subObject).filter(key => subObject.hasOwnProperty(key));
    
            for(const key of keys) {
                const value = subObject[key];
                const isKeyAnObject = typeof value === 'object' && value !== null;
    
                values.push(...(isKeyAnObject ? traverse(value) : [value]));
            }
        
            return values;
        }
    
        return traverse(object);
    },

    /**
     * Merges two objects into one, by default object2 overwites values of object1
     * @param {object} object1 
     * @param {object} object2 
     * @param {boolean} overwrite if overwrite values using object2
     * @returns {object}
     */
    joinObjects: function(object1, object2, overwrite = true) {
        if (typeof object1 !== 'object' || typeof object2 !== 'object') {
            return object1 || object2;
        }

        const result = {};

        for (const key in object1) {
            result[key] = joinObjects(object1[key], object2[key], overwrite);
        }

        for (const key in object2) {
            if (overwrite && result.hasOwnProperty(key)) continue;
            result[key] = object2[key];
        }

        return result;
    }
}