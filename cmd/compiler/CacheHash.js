const { getRandomCharacters } = require("./src/utils/stringUtil");

class Hash {
    /** @type {string} */
    #hash;

    generateHash() {
        if(this.#hash) return;
        
        this.#hash = getRandomCharacters(16);
    }

    /**
     * @returns {string}
     */
    getHash() {
        return this.#hash;
    }
}

const CacheHash = new Hash();

module.exports = CacheHash;