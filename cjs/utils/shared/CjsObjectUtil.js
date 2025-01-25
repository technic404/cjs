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
    join: function(object1, object2, overwrite = true) {
        const traverse = (obj1, obj2, overwrite) => {
            if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
                return obj1 || obj2;
            }
    
            const result = {};
    
            for (const key in obj1) {
                result[key] = traverse(obj1[key], obj2[key], overwrite);
            }
    
            for (const key in obj2) {
                if (overwrite && result.hasOwnProperty(key)) continue;
                result[key] = obj2[key];
            }
    
            return result;
        }
      
        return traverse(object1, object2, overwrite);
    },
    /**
     * Performs deep object copy
     * @param {*} object
     * @returns {*}
     */
    copy: function(object) {
        const traverse = (obj) => {
            if(obj === null) return null;
            
            const isPrimitive = typeof obj !== 'object';
            
            if(isPrimitive) return obj;
            
            if(Array.isArray(obj)) {
                const arrayClone = [];
        
                obj.forEach(o => arrayClone.push(traverse(o)));
        
                return arrayClone;
            }
            
            const objectClone = {};
            
            for(const [key, value] of Object.entries(obj)) {
                objectClone[key] = traverse(value);
            }
            
            return objectClone;
        }
        
        return traverse(object);
    }
}