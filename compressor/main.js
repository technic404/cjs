const fs = require('fs');
const StyleCompressor = require("./src/style/styleCompressor");
const JsCompressor = require("./src/js/jsCompressor");
const DetailsCompressor = require('./src/details/detailsCompressor');
const IndexCompressor = require('./src/index/indexCompressor');
const { toYMDhms } = require('./src/utils/dateUtil');

const directory = "../src";

const style = new StyleCompressor(directory);
const js = new JsCompressor(directory);
const details = new DetailsCompressor(directory);
const index = new IndexCompressor(directory);

(async () => {
    console.log('executed');

    const styleData = await style.getData();
    const jsData = await js.getData();
    const detailsData = await details.getData();
    const indexData = await index.getData(styleData.map);
    
    const inAssetsDirectory = `${directory}/assets`;

    const outDirectory = `./out/${toYMDhms()}`;
    const outAssetsDirectory = `${outDirectory}/src/assets`;

    if(!fs.existsSync(outDirectory)) { fs.mkdirSync(outDirectory, { recursive: true }); }
    if(!fs.existsSync(outAssetsDirectory)) { fs.mkdirSync(outAssetsDirectory, { recursive: true }) }

    fs.writeFileSync(`${outDirectory}/script.js`, detailsData.content + "\n\n" + jsData.content);
    fs.writeFileSync(`${outDirectory}/cup.js`, jsData.compressedFrameworkScript);
    fs.writeFileSync(`${outDirectory}/style.css`, styleData.content);
    fs.writeFileSync(`${outDirectory}/index.html`, indexData.content);

    fs.cpSync(inAssetsDirectory, outAssetsDirectory, { recursive: true });

    process.exit();
})();