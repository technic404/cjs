/**
 * @typedef {object} Config
 * @property {string} version
 * @property {CompilerConfig} compiler
 * @property {CreatorConfig} creator
 */

/**
 * @typedef {object} CompilerConfig
 * @property {IndexTagsConfig} globalPagesSettings
 * @property {CompilerOutputConfig} pages
 * @property {boolean} minifyScripts
 * @property {string} libraryPath
 * @property {string} commonPath
 * @property {number} tempWebServerPort
 * @property {boolean} createEngineSearchContent
 * @property {string} output Folder of the compiled website files
 */

/**
 * @typedef {object} CreatorConfig
 * @property {boolean} autoAddClassNames
 * @property {boolean} autoSetTagNames
 * @property {boolean} includeDefaultText
 * @property {boolean} createWithSplitLines
 * @property {number} topEmptyLines
 * @property {string} stringReturnPrefix
 */

/**
 * @typedef {Object.<string, IndexTagsConfig>} CompilerOutputConfig
 */

/**
 * @typedef {object} Preload
 * @property {string} href
 * @property {string} [as]
 * @property {string} [type]
 * @property {number} [fromWidth]
 * @property {number} [toWidth]
 * @property {number} [fromHeight]
 * @property {number} [toHeight]
 * @property {"landscape"|"portrait"} [orientation]
 */

/**
 * @typedef {object} IndexTagsConfig
 * @property {string} [lang] website language
 * @property {string} [title] website title
 * @property {string} [shortTitle] website short title
 * @property {string} [canonical] website canonical link
 * @property {string} [icon] website icon
 * @property {string} [cover] website cover image
 * @property {string} [description] website description
 * @property {string} [themeColor] hex color of website
 * @property {string} [backgroundColor] hex background color of website
 * @property {string} [author] creator of website
 * @property {string[]} [keywords] tags of website
 * @property {string[]} [robots] instruction to robots about website crawling
 * @property {Preload[]} [preloads] list of path to assets that will be included in head link preload tag
 * @property {IndexSocialMediaTagsConfig} [socialMedia] setting about tags readed by social media platforms
 */

/**
 * @typedef {object} IndexSocialMediaTagsConfig 
 * @property {string} [title] og:title
 * @property {string} [description] og:description
 * @property {string} [image] og:image
 * @property {string} [url] og:url
 * @property {IndexTwitterTagsConfig} [twitter]
 */

/**
 * @typedef {object} IndexTwitterTagsConfig
 * @property {boolean} [enabled] determinates if the twitter tags should be enabled
 * @property {"summary"|"summary_large_image"|"app"|"player"|"product"|"gallery"} [card] rich media representation format
 */

/**
 * @typedef {object} CjsCreatorNames
 * @property {string} camelStyle
 * @property {string} pascalCase
 */

/**
 * @typedef {object} CjsCommandFlags
 * @property {string} target used to determinate under which component create part
 * @property {string} layout used to determinate where create a component
 * @property {string} dir used to determinate extra folder of a component
 */

module.exports = {
    Config: {}, 
    CompilerConfig: {},
    CompilerOutputConfig: {},
    IndexTagsConfig: {},
    IndexSocialMediaTagsConfig: {},
    IndexTwitterTagsConfig: {},
    ProjectInitOptions: {},
    CjsCommandFlags: {}
}