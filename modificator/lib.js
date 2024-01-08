const readConfig = require("./config/configReader");
const Cjs = require("./framework/cjsLibrary");

const cjs = new Cjs(readConfig());

module.exports = {
    cjs: cjs
}