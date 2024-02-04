const fs = require('fs');
const { PrefixError } = require('../../defaults');

class CjsConfig {
    #Paths = {
        UserConfig: "../cjs.json",
        DefaultConfig: "./framework/assets/json/default-config.json"
    };

    constructor() {

    }

    /**
     * Validates if default config was found or not, also displays error message
     * @returns {boolean}
     */
    validate() {
        if(!fs.existsSync(this.#Paths.DefaultConfig)) {
            console.log(`${PrefixError}Default config not found, could not read user config file`)
            return false;
        }
        
        return true;
    }

    /**
     * Provides default config
     * @returns {import('../../types').Config}
     */
    getDefault() {
        return JSON.parse(fs.readFileSync(this.#Paths.DefaultConfig, { encoding: 'utf-8' }));
    }

    /**
     * Provides raw user config without merged values in default config, if not found provides default config
     * @returns {import('../../types').Config}
     */
    getRawUser() {
        const userConfigExists = fs.existsSync(this.#Paths.UserConfig);

        return (
            userConfigExists
            ? JSON.parse(fs.readFileSync(this.#Paths.UserConfig, { encoding: 'utf-8' }))
            : this.getDefault()
        );
    }

    /**
     * Provides user config with merged values in default config
     * @returns {import('../../types').Config}
     */
    getUser() {
        const userConfig = this.getRawUser();
        const defaultConfig = this.getDefault();

        const mergeConfig = (defaultConfig, userSettings) => {
            // Deep clone the default configuration to avoid modifying it directly
            const mergedConfig = JSON.parse(JSON.stringify(defaultConfig));
        
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
            mergeObjects(mergedConfig, userSettings);
        
            return mergedConfig;
        }
    
        return mergeConfig(defaultConfig, userConfig);
    }

    /**
     * Replaces existing config with that provided in argument
     * @param {import('../../types').Config} userRawConfig 
     */
    write(userRawConfig) {
        fs.writeFileSync(this.#Paths.UserConfig, JSON.stringify(userRawConfig, null, 4));
    }
}

module.exports = CjsConfig;