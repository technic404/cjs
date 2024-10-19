const fs = require('fs');
const { PrefixError } = require('../../defaults');
const { mergeObjects } = require('../utils/objects');

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
    
        return mergeObjects(defaultConfig, userConfig);
    }

    /**
     * Replaces existing config with that provided in argument
     * @param {import('../../types').Config} userRawConfig 
     */
    write(userRawConfig) {
        fs.writeFileSync(this.#Paths.UserConfig, JSON.stringify(userRawConfig, null, 4));
    }

    /**
     * Copy a default config to the user config path
     */
    create() {
        fs.copyFileSync(this.#Paths.DefaultConfig, this.#Paths.UserConfig);
    }
}

module.exports = CjsConfig;