const fs = require('fs');
const { cjs } = require('../lib');
const IndexCreator = require('./src/IndexCreator');
const Constants = require('./Constants');
const UglifyJS = require("uglify-js");
const JavaScriptMerger = require('./src/JavaScriptMerger');
const { cjsConfig } = require('../constants');
const StyleCreator = require('./src/StyleCreator');

const Compiler = {
    compile: (input, output) => {
        const styleData = StyleCreator.getStyleData(input);
        const styleContent = styleData.content;
        const styleMap = styleData.map;
        const workerData = JavaScriptMerger.getWorkerData(input);
        const scriptContent = workerData.content;

        fs.writeFileSync(`${output}/style.css`, styleContent);
        fs.writeFileSync(`${output}/index.html`, IndexCreator.getHtml(input, styleMap));
        fs.writeFileSync(`${output}/${Constants.LibraryFileName}`, cjs.library.getContent());
        fs.writeFileSync(`${output}/${Constants.ScriptFileName}`, ( cjsConfig.getUser().compiler.minifyScripts
            ? UglifyJS.minify(scriptContent).code
            : scriptContent
        ));

        fs.cpSync(`${input}/assets`, `${output}/src/assets`, { recursive: true });
    }
}

module.exports = Compiler;