const fs = require('fs');
const IndexCreator = require('./src/IndexCreator');
const Constants = require('./Constants');
const UglifyJS = require("uglify-js");
const JavaScriptMerger = require('./src/JavaScriptMerger');
const StyleCreator = require('./src/StyleCreator');
const { cjs } = require('../lib');
const { cjsConfig } = require('../constants');
const { PrefixError } = require('../defaults');
const ManifestCreator = require('./src/ManifestCreator');

const Compiler = {
    compile: (input, output) => {
        const inputFolderExists = fs.existsSync(input);

        if(!inputFolderExists) {
            console.log(`${PrefixError}The project folder doesn't exists`);
            process.exit();
        }

        const styleData = StyleCreator.getStyleData(input);
        const styleContent = styleData.content;
        const styleMap = styleData.map;
        const workerData = JavaScriptMerger.getWorkerData(input);
        const scriptContent = workerData.content;
        const outputFolderExists = fs.existsSync(output);
        const manifestContent = ManifestCreator.getContent();

        if(!outputFolderExists) fs.mkdirSync(output, { recursive: true });

        fs.writeFileSync(`${output}/manifest.json`, manifestContent);
        fs.writeFileSync(`${output}/${Constants.StyleFileName}`, styleContent);
        fs.writeFileSync(`${output}/${Constants.IndexFileName}`, IndexCreator.getHtml(input, styleMap));
        fs.writeFileSync(`${output}/${Constants.LibraryFileName}`, cjs.library.getContent());
        fs.writeFileSync(`${output}/${Constants.ScriptFileName}`, cjsConfig.getUser().compiler.minifyScripts
            ? UglifyJS.minify(scriptContent).code
            : scriptContent
        );

        fs.cpSync(`${input}/assets`, `${output}/src/assets`, { recursive: true });
    }
}

module.exports = Compiler;