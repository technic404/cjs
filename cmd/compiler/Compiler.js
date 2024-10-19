const fs = require('fs');
const path = require('path');
const PageCreator = require('./src/PageCreator');
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
const PageContentReader = require('./src/PageContentReader');
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
        
        const indexPage = new PageCreator(input, styleMap);

        fs.mkdirSync(output, { recursive: true });
        fs.writeFileSync(`${output}/manifest.json`, manifestContent);
        fs.writeFileSync(`${output}/${Constants.StyleFileName}`, styleContent);
        fs.writeFileSync(`${output}/${Constants.IndexFileName}`, indexPage.getHtml());
        fs.writeFileSync(`${output}/${Constants.LibraryFileName}`, cjs.library.getContent());
        fs.writeFileSync(`${output}/${Constants.ScriptFileName}`, cjsConfig.getUser().compiler.minifyScripts
            ? UglifyJS.minify(scriptContent).code
            : scriptContent
        );

        fs.cpSync(`${input}/assets`, `${output}/src/assets`, { recursive: true });

        const tws = new TempWebServer(output);
        const cjsCompilerFileName = `cjscompiler-${getRandomCharacters(8)}.html`;
        const cjsCompilerFilePath = `${output}/${cjsCompilerFileName}`;

        fs.writeFileSync(cjsCompilerFilePath, `
            <html>
                <head>
                    <script src="c.js"></script>
                    <script>
                        function cjsPerform() {
                            ${PageContentReader.getInitHtmlContentScript(input, tws.address, workerMap)}
                        }
                    </script>
                    <script defer src="worker.js" onload="cjsPerform();"></script>
                </head>
                <body>
                </body>
            </html>`
        );

        console.log(`${PrefixGreen}Creating engine serach content ...`);

        tws.onLoad((url) => {
            console.log(`${PrefixGreen}Temporary server started, loading enginge search content ...`);
            openUrl(`${url}/${cjsCompilerFileName}`);
        });
        
        return new Promise((resolve, _) => {
            tws.listenOn("post", "/content", ((data) => {
                /** @type {{ route: string, html: string, progressed: { count: number, total: number, isLast: boolean } }} */
                const body = data.body;
                const { progressed } = body;
    
                console.log(`${PrefixGreen}Creating engine search content for ${Colors.green}${body.route}${Colors.none} (${progressed.count}/${progressed.total})`);
              
                const filePath = `${output}/${body.route}.html`;
                const directory = path.dirname(filePath);
    
                if(!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
    
                const pageCreator = new PageCreator(input, styleMap)
                    .setBodyContent(body.html.replaceAll("    ", "").replaceAll("\n", ""));
    
                fs.writeFileSync(filePath, pageCreator.getHtml());
    
                if(progressed.isLast) {
                    tws.close();
                    resolve();
                    fs.rmSync(cjsCompilerFilePath);
                }
            }));
        });
    }
}

module.exports = Compiler;