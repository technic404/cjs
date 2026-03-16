export const CjsObjectUtil = {

    /**
     * Returns values from keys if the value is not an object
     */
    getNonObjectValues<T extends Record<string, any>>(object: T): any[] {
        const traverse = (subObject: any): any[] => {

            if (!subObject || typeof subObject !== "object") return [subObject];

            const values: any[] = [];

            for (const key of Object.keys(subObject)) {

                const value = subObject[key];

                const isObject =
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value);

                values.push(...(isObject ? traverse(value) : [value]));
            }

            return values;
        };

        return traverse(object);
    },


    /**
     * Deep merges two objects
     * object2 overwrites object1 by default
     */
    join<T extends Record<string, any>, U extends Record<string, any>>(
        object1: T,
        object2: U,
        overwrite = true
    ): T & U {
        const traverse = (obj1: any, obj2: any): any => {

            if (typeof obj1 !== "object" || obj1 === null) {
                return obj2 ?? obj1;
            }

            const result: any = Array.isArray(obj1) ? [...obj1] : {};

            const keys = new Set([
                ...Object.keys(obj1 ?? {}),
                ...Object.keys(obj2 ?? {})
            ]);

            for (const key of keys) {

                if (!(key in obj2)) {
                    result[key] = obj1?.[key];
                    continue;
                }

                if (!overwrite && key in obj1) {
                    result[key] = obj1[key];
                } else {
                    result[key] = traverse(obj1?.[key], obj2?.[key]);
                }
            }

            return result;
        };

        return traverse(object1, object2);
    },


    /**
     * Deep copy of an object
     */
    copy<T>(object: T): T {
        const traverse = (obj: any): any => {

            if (obj === null) return null;

            const isPrimitive = typeof obj !== "object";
            const isHTMLElement =
                typeof HTMLElement !== "undefined" &&
                (obj instanceof HTMLElement || obj instanceof Node);

            if (isPrimitive || isHTMLElement) return obj;

            if (Array.isArray(obj)) {
                return obj.map(item => traverse(item));
            }

            const cloned: any = {};

            for (const [key, value] of Object.entries(obj)) {
                cloned[key] = traverse(value);
            }

            return cloned;
        };

        return traverse(object);
    },


    /**
     * Removes keys that have nullable / empty values (mutates object)
     */
    filterOutNullableValues<T extends Record<string, any>>(object: T): T {
        for (const [key, value] of Object.entries(object)) {

            const isEmptyObject =
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value) &&
                Object.keys(value).length === 0;

            const shouldDelete =
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === "string" && value.trim() === "") ||
                isEmptyObject;

            if (shouldDelete) {
                delete (object as any)[key];
            }
        }

        return object;
    },

    isEmpty(object: object) {
        return Object.keys(object).length > 0;
    }
};