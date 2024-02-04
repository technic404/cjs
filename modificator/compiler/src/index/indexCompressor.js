const { getRecursivelyDirectoryFiles } = require("../utils/fileUtil");
const { getRandomCharacters } = require("../utils/stringUtil");
const { createHtmlStructure } = require("./indexParser");
const Tag = require("./tags/Tag");
const Attr = require("./tags/Attr");
const { cjsConfig } = require("../../../constants");

class IndexCompressor {
    constructor(inputDirectory) {
        this.inputDirectory = inputDirectory
    }

    /**
     * 
     * @param {Map} styleData
     * @returns {String}
     */
    getData(styleData = new Map()) {
        const QUERY_PARAM_LENGTH = 16;

        const config = cjsConfig.getUser().compiler.output.index;

        const stringMap = JSON.stringify(Array.from(styleData.entries()).map(e => { return [e[0].replace("../", "./"), e[1] ] }));
        const runnableScript = `const CjsRunnableDetails = { style: { map: new Map(${stringMap}) } };`;

        const assetsDirectory = `${this.inputDirectory}/assets`;
        const assets = getRecursivelyDirectoryFiles(assetsDirectory);
        const extraHeadAssetsTags = [];

        assets.forEach(asset => {
            const cuttedOffPath = asset.replaceAll("\\", "/").replace(assetsDirectory, "./src/assets");
            if(asset.endsWith(".css")) {
                extraHeadAssetsTags.push(
                    new Tag("link").addAttributes(new Attr("rel", "stylesheet"), new Attr("href", `${cuttedOffPath}?v=${getRandomCharacters(QUERY_PARAM_LENGTH)}`))
                );
                return;
            }

            if(asset.endsWith(".js")) {
                extraHeadAssetsTags.push(
                    new Tag("script").addAttributes(new Attr("src", `${cuttedOffPath}?v=${getRandomCharacters(QUERY_PARAM_LENGTH)}`))
                );
                return;
            }
        })

        const html = createHtmlStructure({
            htmlAttributes: [
                { name: "lang", value: "en" }
            ],
            head: [
                new Tag("meta").addAttributes(new Attr("charset", "UTF-8")),
                new Tag("meta").addAttributes(new Attr("name", "viewport"), new Attr("content", "width=device-width, initial-scale=1.0")),
                
                new Tag("meta").addAttributes(new Attr("http-equiv", "Cache-Control"), new Attr("content", "no-store, no-cache, must-revalidate")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Pragma"), new Attr("content", "no-cache")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Expires"), new Attr("content", "0")),
                
                new Tag(null),
                
                new Tag("title").setText(config.title),
                
                new Tag(null),
                
                (config.icon !== null ? new Tag("link").addAttributes(new Attr("rel", "icon"), new Attr("href", config.icon)) : null),
                
                new Tag("meta").addAttributes(new Attr("name", "description"), new Attr("content", config.description)),
                new Tag("meta").addAttributes(new Attr("name", "theme-color"), new Attr("content", config.themeColor)),

                (config.author !== null ? new Tag("meta").addAttributes(new Attr("name", "author"), new Attr("content", config.author)) : null),
                (config.keywords.length > 0 ? new Tag("meta").addAttributes(new Attr("name", "keywords"), new Attr("content", config.keywords.join(", "))) : null),
                (config.robots.length > 0 ? new Tag("meta").addAttributes(new Attr("name", "robots"), new Attr("content", config.robots.join(", "))) : null),
                (config.socialMedia.title !== null ? new Tag("meta").addAttributes(new Attr("property", "og:title"), new Attr("content", config.socialMedia.title)) : null),
                (config.socialMedia.description !== null ? new Tag("meta").addAttributes(new Attr("property", "og:description"), new Attr("content", config.socialMedia.description)) : null),
                (config.socialMedia.image !== null ? new Tag("meta").addAttributes(new Attr("property", "og:image"), new Attr("content", config.socialMedia.image)) : null),
                (config.socialMedia.url !== null ? new Tag("meta").addAttributes(new Attr("property", "og:url"), new Attr("content", config.socialMedia.url)) : null),
                
                new Tag(null),
                
                (config.socialMedia.twitter.card !== null && config.socialMedia.twitter.enabled ? new Tag("meta").addAttributes(new Attr("name", "twitter:card"), new Attr("content", config.socialMedia.twitter.card)) : null),
                (config.socialMedia.title !== null && config.socialMedia.twitter.enabled ? new Tag("meta").addAttributes(new Attr("name", "twitter:title"), new Attr("content", config.socialMedia.title)) : null),
                (config.socialMedia.description !== null && config.socialMedia.twitter.enabled ? new Tag("meta").addAttributes(new Attr("name", "twitter:description"), new Attr("content", config.socialMedia.description)) : null),
                (config.socialMedia.image !== null && config.socialMedia.twitter.enabled ? new Tag("meta").addAttributes(new Attr("name", "twitter:image"), new Attr("content", config.socialMedia.description)) : null),
                
                new Tag(null),

                ...extraHeadAssetsTags,

                new Tag(null),
                
                new Tag("link").addAttributes(new Attr("rel", "stylesheet"), new Attr("href", `style.css?v=${getRandomCharacters(QUERY_PARAM_LENGTH)}`)),
                
                new Tag(null),

                new Tag("style").addAttributes(new Attr("id", "c_js-style-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-filters-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-keyframes-")),

                new Tag(null),
                
                new Tag("script").setText(runnableScript),
                new Tag("script").addAttributes(new Attr("src", `cup.js?v=${getRandomCharacters(QUERY_PARAM_LENGTH)}`)),
                new Tag("script").addAttributes(new Attr("defer"), new Attr("src", `script.js?v=${getRandomCharacters(QUERY_PARAM_LENGTH)}`)),
            ]
        })

        return {
            content: html
        }
    }
}

module.exports = IndexCompressor;