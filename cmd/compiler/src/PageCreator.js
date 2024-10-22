const { cjsConfig } = require("../../constants");
const { mergeObjects } = require("../../framework/utils/objects");
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
     * @param {() => Tag} returnCallback 
     * @returns {*|[]}
     */
    #exists (object, returnCallback) {
        if(object !== null && object !== undefined) return returnCallback();
        if(Array.isArray(object) && object.length > 0) return returnCallback();

        return [];
    }

    /**
     * Returns parsed path that does not start with `./` and `/`
     * @param {string} path 
     * @returns {string}
     */
    #parsePath(path) {
        if(path.startsWith("./")) return path.slice(2);

        if(path.startsWith("/")) return path.slice(1);

        return path;
    }

    /**
     * @param {string} route
     * @param {string} input ./src directory
     * @param {Map} styleData of files import
     */
    constructor(route, input, styleData) {
        super();

        this.route = route;
        this.input = input;
        this.styleData = styleData;
        this.relativeParts = this.#parsePath(this.route).split("/").slice(1);
        this.relative = this.relativeParts.map(_ => `../`);
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
                relativePathPosition: ${this.relativeParts.length},
                tempWebServerPort: ${cjsConfig.getUser().compiler.tempWebServerPort},
                style: { 
                    map: new Map(${stringMap})
                }
            };
        `;
    }

    /**
     * @param {import("../../types").Preload[]} preloads
     * @returns {Tag[]}
     */
    _getPrealoads(preloads) {
        const tags = [];
        const fileTypes = {
            image: ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "ico"],
            script: ["js", "mjs"],
            style: ["css"],
            font: ["woff2", "woff", "ttf", "otf", "eot"],
            fetch: ["json", "xml", "txt"],
            document: ["html", "xhtml", "htm"],
            object: ["swf", "pdf"],
            video: ["mp4", "webm"],
            track: ["vtt", "srt"],
            audio: ["mp3", "wav", "ogg", "m4a"]
        }
        const mapping = {
            /**
             * @param {string} href 
             * @returns {string}
             */
            as: (href) => {
                for(const [fileType, extensions] of Object.entries(fileTypes)) {
                    const extensionsMatch = extensions.map(e => `.${e}`).includes(path.extname(href));

                    if(extensionsMatch) return fileType;
                }
            },
            /**
             * @param {string} href file source
             * @param {string} as file type
             * @returns {string}
             */
            type: (href, as) => {
                const unCommonTypes = {
                    script: (ext) => "application/javascript",
                    style: (ext) => "text/css",
                    fetch: (ext) => {
                        if(["json", "xml"].includes(ext)) return `application/${ext}`;

                        return `text/plain`;
                    },
                    document: (ext) => `text/${ext}`,
                    object: (ext) => {
                        if(["swf"].includes(ext)) return `application/x-shockwave-flash`;

                        return `application/${ext}`
                    },
                    track: (ext) => `text/${ext}`
                }

                const rawExtension = path.extname(href);
                const extension = rawExtension.startsWith(".") ? rawExtension.slice(1) : rawExtension;

                if(as in unCommonTypes) return unCommonTypes[as](extension);

                return `${as}/${extension}`;
            }
        }

        for(const preload of preloads) {
            const tag = new Tag("link").addAttributes(new Attr("rel", "preload"), new Attr("href", this.relative + this.#parsePath(preload.href)));

            if(
                /**
                 * Determinates if one of the keys exists in preload
                 * @returns {boolean}
                 */
                (() => 
                    ["fromWidth", "fromHeight", "toWidth", "toHeight", "orientation"]
                        .filter(key => key in preload)
                        .length > 0
                )()
            ) {
                const mediaParts = [];

                if("orientation" in preload) mediaParts.push(`(orientation: ${preload.orientation})`);
                if("fromWidth" in preload) mediaParts.push(`(min-width: ${preload.fromWidth}px)`);
                if("toWidth" in preload) mediaParts.push(`(max-width: ${preload.toWidth}px)`);
                if("fromHeight" in preload) mediaParts.push(`(min-height: ${preload.fromHeight}px)`);
                if("toHeight" in preload) mediaParts.push(`(max-height: ${preload.toHeight}px)`);

                tag.addAttributes(new Attr("media", mediaParts.join(" and ")));
            }

            const as = "as" in preload ? preload.as : mapping.as(preload.href);
            const type = "type" in preload ? preload.type : mapping.type(preload.href, as);

            tag.addAttributes(new Attr("as", as), new Attr("type", type));

            tags.push(tag);
        }

        return tags;
    }

    /**
     * @returns {Tag[]}
     */
    _getAssetsTags() {
        const assetsDirectory = `${this.input}/assets`;
        const assetModifiers = {
            ".css": (path) => new Tag("link").addAttributes(
                new Attr("rel", "stylesheet"), 
                new Attr("href", `${path}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)
            ),
            ".js": (path) => new Tag("script").addAttributes(
                new Attr("src", `${path}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)
            )
        }

        return getRecursivelyDirectoryFiles(assetsDirectory).map(asset => {
            const srcPath = asset.replaceAll("\\", "/").replace(assetsDirectory, `${this.relative}src/assets`);
            const extension = path.extname(srcPath);

            if(!(extension in assetModifiers)) return null;

            return assetModifiers[extension](srcPath);
        }).filter(e => e !== null);
    }

    getHtml() {
        const compiler = cjsConfig.getUser().compiler;
        const { pages, globalPagesSettings } = compiler;

        /** @type {import("../../types").IndexTagsConfig} */
        const config = mergeObjects(globalPagesSettings, this.route in pages ? pages[this.route] : {});

        return this._getHtml({
            htmlAttributes: [
                this.#exists(config.lang, () => new Attr("lang", config.lang))
            ],
            head: [
                new Tag("meta").addAttributes(new Attr("charset", "UTF-8")),
                new Tag("meta").addAttributes(new Attr("name", "viewport"), new Attr("content", "width=device-width, initial-scale=1.0")),
                
                new Tag("meta").addAttributes(new Attr("http-equiv", "Content-Type"), new Attr("content", "text/html; charset=utf-8")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Cache-Control"), new Attr("content", "no-store, no-cache, must-revalidate")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Pragma"), new Attr("content", "no-cache")),
                new Tag("meta").addAttributes(new Attr("http-equiv", "Expires"), new Attr("content", "0")),
                
                new Tag(null),
                
                this.#exists(config.title, () => new Tag("title").setText(config.title)),
                
                new Tag(null),

                // new Tag("link").addAttributes(
                //     new Attr("rel", "preload"), 
                //     new Attr("href", `${Constants.LibraryFileName}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`),
                //     new Attr("as", "script"),
                //     new Attr("type", "application/javascript")
                // ),

                new Tag(null),
                
                this.#exists(config.icon, () => new Tag("link").addAttributes(new Attr("rel", "icon"), new Attr("href", this.relative + this.#parsePath(config.icon)))),
                this.#exists(config.icon, () => new Tag("link").addAttributes(new Attr("rel", "apple-touch-icon"), new Attr("href", this.relative + this.#parsePath(config.icon)))),

                this.#exists(config.description, () => new Tag("meta").addAttributes(new Attr("name", "description"), new Attr("content", config.description))),
                this.#exists(config.themeColor, () => new Tag("meta").addAttributes(new Attr("name", "theme-color"), new Attr("content", config.themeColor))),

                this.#exists(config.author, () => new Tag("meta").addAttributes(new Attr("name", "author"), new Attr("content", config.author))),
                this.#exists(config.keywords, () => new Tag("meta").addAttributes(new Attr("name", "keywords"), new Attr("content", config.keywords.join(", ")))),
                this.#exists(config.robots, () => new Tag("meta").addAttributes(new Attr("name", "robots"), new Attr("content", config.robots.join(", ")))),
                
                ...this.#exists(config.socialMedia, () => [
                    new Tag(null),

                    this.#exists(config.socialMedia.title, () => new Tag("meta").addAttributes(new Attr("property", "og:title"), new Attr("content", config.socialMedia.title))),
                    this.#exists(config.socialMedia.description, () => new Tag("meta").addAttributes(new Attr("property", "og:description"), new Attr("content", config.socialMedia.description))),
                    this.#exists(config.socialMedia.image, () => new Tag("meta").addAttributes(new Attr("property", "og:image"), new Attr("content", this.relative + this.#parsePath(config.socialMedia.image)))),
                    this.#exists(config.socialMedia.url, () => new Tag("meta").addAttributes(new Attr("property", "og:url"), new Attr("content", config.socialMedia.url))),
                
                    ...this.#exists(config.socialMedia.twitter, () => 
                        config.socialMedia.twitter.enabled ? [
                            new Tag(null),

                            this.#exists(config.socialMedia.twitter.card, () => new Tag("meta").addAttributes(new Attr("name", "twitter:card"), new Attr("content", config.socialMedia.twitter.card))),
                            this.#exists(config.socialMedia.title, () => new Tag("meta").addAttributes(new Attr("name", "twitter:title"), new Attr("content", config.socialMedia.title))),
                            this.#exists(config.socialMedia.description, () => new Tag("meta").addAttributes(new Attr("name", "twitter:description"), new Attr("content", config.socialMedia.description))),
                            this.#exists(config.socialMedia.image, () => new Tag("meta").addAttributes(new Attr("name", "twitter:image"), new Attr("content", this.relative + this.#parsePath(config.socialMedia.image)))),
                           
                        ] : []
                    )
                ]),

                new Tag(null),
                
                this.#exists(config.cover, () => new Tag("link").addAttributes(new Attr("property", "og:image"), new Attr("content", config.cover))),

                new Tag("link").addAttributes(new Attr("rel", "stylesheet"), new Attr("href", `${this.relative}style.css?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)),
                
                new Tag(null),

                new Tag("style").addAttributes(new Attr("id", "c_js-style-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-filters-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-keyframes-")),
                new Tag("style").addAttributes(new Attr("id", "c_js-plugins-")),

                new Tag(null),
                
                new Tag("script").setText(this._getRunnableScript()),
                new Tag("script").addAttributes(new Attr("src", `${this.relative}${Constants.LibraryFileName}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)),
                new Tag("script").addAttributes(new Attr("defer"), new Attr("src", `${this.relative}${Constants.ScriptFileName}?v=${getRandomCharacters(this.#QUERY_ID_HASH_LENGTH)}`)),
            
                new Tag(null),

                ...this._getAssetsTags(),

                new Tag(null),

                ...this._getPrealoads(config.preloads)
                
            ],
            body: this.#bodyContent
        })
    }
}

module.exports = PageCreator;