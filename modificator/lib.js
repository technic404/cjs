const { cjsConfig } = require("./constants");
const Cjs = require("./framework/library");

const cjs = new Cjs(cjsConfig.getUser());

module.exports = {
    cjs: cjs,
}