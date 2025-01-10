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
const { PrefixError, PrefixGreen, Colors, PrefixLog } = require('../defaults');
const { openUrl } = require('./src/utils/BrowserUtil');
const TempWebServer = require('./src/TempWebServer');
const PageContentReader = require('./src/PageContentReader');
const { getRandomCharacters } = require('./src/utils/stringUtil');


const Compiler = {
    compile: async (input, output, verbose = false) => {
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
        const warningMessages = workerData.warningMessages;
        const outputFolderExists = fs.existsSync(output);
        const manifestContent = ManifestCreator.getContent();

        if(outputFolderExists) fs.rmSync(output, { recursive: true, force: true });
        
        const indexPage = new PageCreator("index", input, styleMap);

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

        if(warningMessages.length > 0) {
            if(verbose) {
                warningMessages.forEach(msg => console.log(msg));
            } else {
                console.log(`${PrefixError}Created ${Colors.red}${warningMessages.length}${Colors.none} warnings, use --verbose to see the details`);
            }
        }

        const tws = new TempWebServer(output);
        const cjsCompilerFileName = `cjscompiler-${getRandomCharacters(8)}.html`;
        const cjsCompilerFilePath = `${output}/${cjsCompilerFileName}`;

        fs.writeFileSync(cjsCompilerFilePath, `
            <html>
                <head>
                    <style id="c_js-style-"></style>
                    <style id="c_js-filters-"></style>
                    <style id="c_js-keyframes-"></style>
                    <style id="c_js-plugins-"></style>
                    
                    <script src="${Constants.LibraryFileName}"></script>
                    <script>
                        function cjsPerform() {
                            ${PageContentReader.getInitHtmlContentScript(input, tws.address, workerMap)}
                        }
                    </script>
                    <script defer src="${Constants.ScriptFileName}" onload="cjsPerform();"></script>
                </head>
                <body>
                </body>
            </html>`
        );

        console.log(`\n${PrefixGreen}Creating engine serach content ...`);

        return new Promise((resolve, _) => {
            tws.onLoad(async (url) => {
                console.log(`${PrefixGreen}Temporary server started, loading enginge search content ...`);

                const browserPromise = openUrl(`${url}/${cjsCompilerFileName}`);

                tws.listenOn("post", "/content", (async (data) => {
                    /** @type {{ route: string, html: string, progressed: { count: number, total: number, isLast: boolean } }} */
                    const body = data.body;
                    const { progressed } = body;

                    console.log(`${PrefixGreen}Creating engine search content for ${Colors.green}${body.route}${Colors.none} (${progressed.count}/${progressed.total})`);

                    const filePath = `${output}/${body.route}.html`;
                    const directory = path.dirname(filePath);

                    if(!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

                    const pageCreator = new PageCreator(body.route, input, styleMap)
                        .setBodyContent(`<div style="display: none;">${body.html.replaceAll("    ", "").replaceAll("\n", "")}</div>`);

                    fs.writeFileSync(filePath, pageCreator.getHtml());

                    if(progressed.isLast) {
                        await (await browserPromise).close();

                        tws.close();
                        fs.rmSync(cjsCompilerFilePath);

                        resolve();
                    }
                }));
            });
        });
    }
}

module.exports = Compiler;