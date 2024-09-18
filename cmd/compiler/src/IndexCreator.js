const { cjsConfig } = require("../../constants");
const Constants = require("../Constants");
const Attr = require("./objects/Attr");
const Tag = require("./objects/Tag");
const { getRecursivelyDirectoryFiles } = require("./utils/fileUtil");
const { getRandomCharacters } = require("./utils/stringUtil");

/**
 * @param {{htmlAttributes?: { name: string, value: string }[], head?: Tag[], body?: Tag[]}} data 
 * @returns {String} html string
 */
function createHtmlStructure(data) {
    if(!("htmlAttributes" in data)) data.htmlAttributes = [];
    if(!("head" in data)) data.head = [];
    if(!("body" in data)) data.body = [];

    const htmlAttributes = data.htmlAttributes.map(e => `${e.name}="${e.value}"`).join(" ")

    let html = `<!DOCTYPE html>\n<html ${htmlAttributes}>\n`;

    html += `    <head>\n`;

    for(const tag of data.head) {
        if(!tag) continue;

        const tagName = tag.tagName;
        const isNewLineSpace = tagName === null;

        if(isNewLineSpace) {
            html += `        <!-- -->\n`;
            continue;
        }

        const isNonClosingTag = ["meta", "link"].includes(tagName.toLowerCase());
        const attributes = ("attributes" in tag ? tag.attributes : []);
        const parsedAttributes = attributes.length > 0 ? " " + attributes.map(e => {
            let str = e.name;
            const hasEmptyValue = e.value === "";

            if(!hasEmptyValue) { str += `="${e.value}"`; }

            return str;
        }).join(" ") : '';
        const text = ("text" in tag ? tag.text : '');

        html += `        <${tagName}${parsedAttributes}${isNonClosingTag ? " /" : ""}>`;

        if(!isNonClosingTag) {
            html += `${text}</${tagName}>`
        }

        html += "\n";
    }

    html += `    </head>\n`;
    html += `    <body>\n`;

    for(const tag of data.body) {
        const tagName = tag.tagName;
        const text = ("text" in tag ? tag.text : '');
        const attributes = ("attributes" in tag ? tag.attributes : []);
        const parsedAttributes = attributes.length > 0 ? " " + attributes.map(e => `${e.name}="${e.value}"`).join(" ") : '';

        html += `        <${tagName}${parsedAttributes}>${text}</${tagName}>`;
    }

    html += `    </body>\n`;
    html += `</html>`;

    return html;
}

const IndexCreator = {
    /**
     * @param {string} input ./src directory
     * @param {Map} styleData of files import
     * @returns {string}
     */
    getHtml: (input, styleData) => {
        const QueryIdHashLength = 16;

        const config = cjsConfig.getUser().compiler.output.index;
        const stringMap = JSON.stringify(Array.from(styleData.entries()).map(e => { return [e[0].replace("../", "./"), e[1] ] }));
        const runnableScript = `const CjsRunnableDetails = { style: { map: new Map(${stringMap}) } };`;
        const assetsDirectory = `${input}/assets`;
        const assets = getRecursivelyDirectoryFiles(assetsDirectory);
        const extraHeadAssetsTags = [];

        assets.forEach(asset => {
            const cuttedOffPath = asset.replaceAll("\\", "/").replace(assetsDirectory, "./src/assets");

            if(asset.endsWith(".css")) {
                extraHeadAssetsTags.push(
                    new Tag("link").addAttributes(new Attr("rel", "stylesheet"), new Attr("href", `${cuttedOffPath}?v=${getRandomCharacters(QueryIdHashLength)}`))
                );
                return;
            }

            if(asset.endsWith(".js")) {
                extraHeadAssetsTags.push(
                    new Tag("script").addAttributes(new Attr("src", `${cuttedOffPath}?v=${getRandomCharacters(QueryIdHashLength)}`))
                );
                return;
            }
        })

        return createHtmlStructure({
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

                new Tag("link").addAttributes(new Attr("rel", "stylesheet"), new Attr("href", `style.css?v=${getRandomCharacters(QueryIdHashLength)}`)),
                
                new Tag(null),

                new Tag("style").addAttributes(new Attr("id", "c_js-style-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-filters-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-keyframes-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-plugins-")),

                new Tag(null),
                
                new Tag("script").setText(runnableScript),
                new Tag("script").addAttributes(new Attr("src", `${Constants.LibraryFileName}?v=${getRandomCharacters(QueryIdHashLength)}`)),
                new Tag("script").addAttributes(new Attr("defer"), new Attr("src", `${Constants.ScriptFileName}?v=${getRandomCharacters(QueryIdHashLength)}`)),
            
                new Tag(null),

                ...extraHeadAssetsTags,
            ]
        })
    }
}

module.exports = IndexCreator;