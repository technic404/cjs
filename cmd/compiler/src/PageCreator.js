const { cjsConfig } = require("../../constants");
const Constants = require("../Constants");
const HtmlCreator = require("./HtmlCreator");
const Attr = require("./objects/Attr");
const Tag = require("./objects/Tag");
const { getRecursivelyDirectoryFiles } = require("./utils/fileUtil");
const { getRandomCharacters } = require("./utils/stringUtil");
const path = require('path');

class PageCreator extends HtmlCreator {

    #QUERY_ID_HASH_LENGTH = 16;

    /** @type {string} */
    #bodyContent = '';

    /**
     * Checks if object exists with specific condition, then returns it or passes null
     * @param {*} object 
     * @param {Tag} toReturn 
     * @returns {*|null}
     */
    #exists (object, toReturn) {
        if(object !== null && object !== undefined) return toReturn;
        if(Array.isArray(object) && object.length > 0) return toReturn;

        return null;
    }

    /**
     * @param {string} input ./src directory
     * @param {Map} styleData of files import
     */
    constructor(input, styleData) {
        super();

        this.input = input;
        this.styleData = styleData;
    }

    /**
     * @param {string} bodyContent 
     * @returns {PageCreator}
     */
    setBodyContent(bodyContent) {
        this.#bodyContent = bodyContent;

        return this;
    }

    /**
     * @returns {string}
     */
    _getRunnableScript() {
        const stringMap = JSON.stringify(Array.from(this.styleData.entries()).map(e => { return [e[0].replace("../", "./"), e[1] ] }));
        
        return `
            const CjsRunnableDetails = {
                compiled: true,
                tempWebServerPort: ${cjsConfig.getUser().compiler.tempWebServerPort},
                style: { 
                    map: new Map(${stringMap})
                }
            };
        `;
    }

    /**
     * @returns {Tag[]}
     */
    _getAssetsTags() {
        const assetsDirectory = `${this.input}/assets`;
        const assetModifiers = {
            "css": (path) => new Tag("link").addAttributes(
                new Attr("rel", "stylesheet"), 
                new Attr("href", `${path}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)
            ),
            "js": (path) => new Tag("script").addAttributes(
                new Attr("src", `${path}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)
            )
        }

        return getRecursivelyDirectoryFiles(assetsDirectory).map(asset => {
            const srcPath = asset.replaceAll("\\", "/").replace(assetsDirectory, "./src/assets");
            const extension = path.extname(srcPath);

            if(!(extension in assetModifiers)) return null;

            return assetModifiers[extension](srcPath);
        }).filter(e => e !== null);
    }

    getHtml() {
        const config = cjsConfig.getUser().compiler.output.index;

        return this._getHtml({
            htmlAttributes: [
                { name: "lang", value: config.lang }
            ],
            head: [
                new Tag("meta").addAttributes(new Attr("charset", "UTF-8")),
                new Tag("meta").addAttributes(new Attr("name", "viewport"), new Attr("content", "width=device-width, initial-scale=1.0")),
                
                new Tag("meta").addAttributes(new Attr("http-equiv", "Content-Type"), new Attr("content", "text/html; charset=utf-8")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Cache-Control"), new Attr("content", "no-store, no-cache, must-revalidate")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Pragma"), new Attr("content", "no-cache")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Expires"), new Attr("content", "0")),
                
                new Tag(null),
                
                new Tag("title").setText(config.title),
                
                new Tag(null),
                
                this.#exists(config.icon, new Tag("link").addAttributes(new Attr("rel", "icon"), new Attr("href", config.icon))),
                this.#exists(config.icon, new Tag("link").addAttributes(new Attr("rel", "apple-touch-icon"), new Attr("href", config.icon))),

                new Tag("meta").addAttributes(new Attr("name", "description"), new Attr("content", config.description)),
                new Tag("meta").addAttributes(new Attr("name", "theme-color"), new Attr("content", config.themeColor)),

                this.#exists(config.author, new Tag("meta").addAttributes(new Attr("name", "author"), new Attr("content", config.author))),
                this.#exists(config.keywords, new Tag("meta").addAttributes(new Attr("name", "keywords"), new Attr("content", config.keywords.join(", ")))),
                this.#exists(config.robots, new Tag("meta").addAttributes(new Attr("name", "robots"), new Attr("content", config.robots.join(", ")))),
                this.#exists(config.socialMedia.title, new Tag("meta").addAttributes(new Attr("property", "og:title"), new Attr("content", config.socialMedia.title))),
                this.#exists(config.socialMedia.description, new Tag("meta").addAttributes(new Attr("property", "og:description"), new Attr("content", config.socialMedia.description))),
                this.#exists(config.socialMedia.image, new Tag("meta").addAttributes(new Attr("property", "og:image"), new Attr("content", config.socialMedia.image))),
                this.#exists(config.socialMedia.url, new Tag("meta").addAttributes(new Attr("property", "og:url"), new Attr("content", config.socialMedia.url))),
                this.#exists(config.cover, new Tag("link").addAttributes(new Attr("property", "og:image"), new Attr("content", config.cover))),

                new Tag(null),
                
                ...(config.socialMedia.twitter.enabled ? [
                    this.#exists(config.socialMedia.twitter.card, new Tag("meta").addAttributes(new Attr("name", "twitter:card"), new Attr("content", config.socialMedia.twitter.card))),
                    this.#exists(config.socialMedia.title, new Tag("meta").addAttributes(new Attr("name", "twitter:title"), new Attr("content", config.socialMedia.title))),
                    this.#exists(config.socialMedia.description, new Tag("meta").addAttributes(new Attr("name", "twitter:description"), new Attr("content", config.socialMedia.description))),
                    this.#exists(config.socialMedia.image, new Tag("meta").addAttributes(new Attr("name", "twitter:image"), new Attr("content", config.socialMedia.description))),
                   
                ] : []),
                
                new Tag(null),

                new Tag("link").addAttributes(new Attr("rel", "stylesheet"), new Attr("href", `style.css?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)),
                
                new Tag(null),

                new Tag("style").addAttributes(new Attr("id", "c_js-style-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-filters-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-keyframes-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-plugins-")),

                new Tag(null),
                
                new Tag("script").setText(this._getRunnableScript()),
                new Tag("script").addAttributes(new Attr("src", `${Constants.LibraryFileName}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)),
                new Tag("script").addAttributes(new Attr("defer"), new Attr("src", `${Constants.ScriptFileName}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)),
            
                new Tag(null),

                ...[
                    ...this._getAssetsTags()
                ],
            ],
            body: this.#bodyContent
        })
    }
}

module.exports = PageCreator;