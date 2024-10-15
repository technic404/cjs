const fs = require('fs');
const path = require('path');
const IndexCreator = require('./src/IndexCreator');
const Constants = require('./Constants');
const UglifyJS = require("uglify-js");
const JavaScriptMerger = require('./src/JavaScriptMerger');
const StyleCreator = require('./src/StyleCreator');
const ManifestCreator = require('./src/ManifestCreator');
const { cjs } = require('../lib');
const { cjsConfig } = require('../constants');
const { PrefixError, PrefixGreen, Colors } = require('../defaults');
const { openUrl } = require('./src/utils/BrowserUtil');
const TempWebServer = require('./src/TempWebServer');
const PagesCreator = require('./src/PagesCreator');
const { getRandomCharacters } = require('./src/utils/stringUtil');

const Compiler = {
    compile: async (input, output) => {
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
        const workerMap = workerData.map;
        const outputFolderExists = fs.existsSync(output);
        const manifestContent = ManifestCreator.getContent();

        if(outputFolderExists) fs.rmSync(output, { recursive: true, force: true });

        fs.mkdirSync(output, { recursive: true });
        fs.writeFileSync(`${output}/manifest.json`, manifestContent);
        fs.writeFileSync(`${output}/${Constants.StyleFileName}`, styleContent);
        fs.writeFileSync(`${output}/${Constants.IndexFileName}`, IndexCreator.getHtml(input, styleMap));
        fs.writeFileSync(`${output}/${Constants.LibraryFileName}`, cjs.library.getContent());
        fs.writeFileSync(`${output}/${Constants.ScriptFileName}`, cjsConfig.getUser().compiler.minifyScripts
            ? UglifyJS.minify(scriptContent).code
            : scriptContent
        );

        fs.cpSync(`${input}/assets`, `${output}/src/assets`, { recursive: true });

        const tws = new TempWebServer(output);
        const cjsCompilerFileName = `cjscompiler-${getRandomCharacters(8)}.html`;

        fs.writeFileSync(
            `${output}/${cjsCompilerFileName}`, 
            `<html>
                <head>
                    <script src="c.js"></script>
                    <script>
                        function createSearchEngineFiles() {
                            ${PagesCreator.getInitHtmlContentScript(input, tws.address, workerMap)}
                        }
                    </script>
                    <script defer src="worker.js" onload="createSearchEngineFiles();"></script>
                </head>
                <body>
                </body>
            </html>`
        );

        const promise = tws.listenOn("post", "/content");

        let filesToProgress = tws.htmlRoutes.length;
        let filesProgressed = 0;

        tws.onLoad((url) => {
            openUrl(`${url}/${cjsCompilerFileName}`);
            // for(const htmlRoute of tws.htmlRoutes) {
            //     openUrl(url + htmlRoute);
            // }
        });

        return new Promise((res) => {
            promise.then(data => {
                console.log(`${PrefixGreen}Creating engine search content for ${Colors.green}${data.body.route}${Colors.none} (${filesProgressed + 1}/${filesToProgress})`);
              
                const filePath = `${output}/${data.body.route}`;
                const directory = path.dirname(filePath);

                if(!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

                const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
                const newFileContent = [];

                newFileContent.push(
                    content.slice(0, -20), 
                    "\n        " + data.body.html.replaceAll("    ", "").replaceAll("\n", ""), 
                    content.slice(content.length - 20)
                );

                fs.writeFileSync(filePath, newFileContent.join(""));

                filesProgressed++;

                if(filesProgressed >= filesToProgress) {
                    tws.close();
                    res();
                }
            });
        });
        
    }
}

module.exports = Compiler;