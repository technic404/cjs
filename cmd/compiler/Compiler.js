const fs = require('fs');
const { cjs } = require('../lib');
const IndexCreator = require('./src/IndexCreator');
const Constants = require('./Constants');
const UglifyJS = require("uglify-js");
const JavaScriptMerger = require('./src/JavaScriptMerger');
const { cjsConfig } = require('../constants');
const StyleCreator = require('./src/StyleCreator');
const { PrefixError } = require('../defaults');

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

        if(!outputFolderExists) fs.mkdirSync(output, { recursive: true });

        const { library } = cjs;

        if(!library.hasCompiledFile() && !library.hasSourceFolder()) {
            console.log(`${PrefixError}Couldn't find the framework source folder or the compiled library file`);
            process.exit();
        }

        const libraryContent = library.hasSourceFolder() ? library.getContent() : library.getCompiledFileContent();

        fs.writeFileSync(`${output}/style.css`, styleContent);
        fs.writeFileSync(`${output}/index.html`, IndexCreator.getHtml(input, styleMap));
        fs.writeFileSync(`${output}/${Constants.LibraryFileName}`, libraryContent);
        fs.writeFileSync(`${output}/${Constants.ScriptFileName}`, ( cjsConfig.getUser().compiler.minifyScripts
            ? UglifyJS.minify(scriptContent).code
            : scriptContent
        ));

        fs.cpSync(`${input}/assets`, `${output}/src/assets`, { recursive: true });
    }
}

module.exports = Compiler;