const CacheHash = require("./CacheHash");

CacheHash.generateHash();

const Constants = {
    LibraryFileName: `cjs.${CacheHash.getHash()}.js`,
    ScriptFileName: `worker.${CacheHash.getHash()}.js`,
    StyleFileName: `style.${CacheHash.getHash()}.css`,
    IndexFileName: "index.html",
    RootLayoutPath: "\\layouts\\root\\RootLayout.mjs",
    RootFilePath: "\\Root.mjs",
    PreRootFilePath: "\\PreRoot.mjs",
    RootLayoutName: "RootLayout.mjs",
    ModuleSetterPrefix: "__init_",
    ExportVariableName: "__export",
    StyleClassPrefix: "x____cjs",
    StyleClassIdHashLength: 6
}

module.exports = Constants;