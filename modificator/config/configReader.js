const fs = require('fs');
const { Prefix } = require('../defaults');
const { Config } = require("../types");

const Paths = {
    UserConfig: "../cjs.json",
    DefaultConfig: "./config/defaultConfig.json"
};

/**
 * Reads the user config (cjs.json) and overrides not set propertieses with defaultConfig.json
 * @returns {Config|null}
 */
function readConfig() {
    if(!fs.existsSync(Paths.DefaultConfig)) {
        console.log(`${Prefix}Default config not found, could not read user config file`)
        return null;
    }

    /**
     * @type {Config}
     */
    const defaultConfig = JSON.parse(fs.readFileSync(Paths.DefaultConfig, { encoding: 'utf-8' }));

    /**
     * @type {Config}
     */
    const userConfig = (
        fs.existsSync(Paths.UserConfig)
        ? JSON.parse(fs.readFileSync(Paths.UserConfig, { encoding: 'utf-8' }))
        : defaultConfig
    );

    const mergeConfig = (defaultConfig, userSettings) => {
        // Deep clone the default configuration to avoid modifying it directly
        const mergedConfig = JSON.parse(JSON.stringify(defaultConfig));
    
        // Recursive function to merge objects
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

module.exports = readConfig;