const readConfig = require("./config/configReader");
const Cjs = require("./framework/library");

const cjs = new Cjs(readConfig());

module.exports = {
    cjs: cjs
}