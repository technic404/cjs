const fs = require('fs');
const StyleCompressor = require("./src/style/styleCompressor");
const JsCompressor = require("./src/js/jsCompressor");
const DetailsCompressor = require('./src/details/detailsCompressor');
const IndexCompressor = require('./src/index/indexCompressor');
const readConfig = require('../config/configReader');
const UglifyJS = require("uglify-js");

/**
 * Compiles the source files of the project
 * 
 * In result the compiler creates files:
 * 
 * `script.js` - all script files from /src project folder
 * 
 * `cup.js` - compressed library cjs files
 * 
 * `style.css` - all styles from /src project folder
 * 
 * `index.html` - mail file that has linked script, cjs, style and propper meta tags
 * 
 * @param {string} input path of the /src folder
 * @param {string} output path of the folder containing compiled files
 */
async function compile(input, output) {
    const style = new StyleCompressor(input);
    const js = new JsCompressor(input);
    const details = new DetailsCompressor(input);
    const index = new IndexCompressor(input);

    const styleData = await style.getData();
    const jsData = await js.getData();
    const detailsData = await details.getData();
    const indexData = index.getData(styleData.map);
    
    const inAssetsDirectory = `${input}/assets`;

    const outDirectory = `${output}`;
    const outAssetsDirectory = `${outDirectory}/src/assets`;

    if(!fs.existsSync(outDirectory)) { fs.mkdirSync(outDirectory, { recursive: true }); }
    if(!fs.existsSync(outAssetsDirectory)) { fs.mkdirSync(outAssetsDirectory, { recursive: true }) }

    const workerScriptContent = detailsData.content + "\n\n" + jsData.content
    const config = readConfig();
    const { minifyScripts } = config.compiler;

    fs.writeFileSync(`${outDirectory}/script.js`, (minifyScripts
        ? UglifyJS.minify(workerScriptContent).code
        : workerScriptContent
    ));

    fs.writeFileSync(`${outDirectory}/cup.js`, (minifyScripts
        ? UglifyJS.minify(jsData.compressedFrameworkScript).code
        : jsData.compressedFrameworkScript
    ));

    fs.writeFileSync(`${outDirectory}/style.css`, styleData.content);
    fs.writeFileSync(`${outDirectory}/index.html`, indexData.content);

    fs.cpSync(inAssetsDirectory, outAssetsDirectory, { recursive: true });
}

module.exports = compile;