class Attr {
    constructor(name, value = null) {
        this.name = name;
        this.value = (value === null ? '' : value);
    }
}

module.exports = Attr;