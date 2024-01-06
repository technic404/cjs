/**
 * @typedef {object} Config
 * @property {string} version
 * @property {CompilerConfig} compiler
 */

/**
 * @typedef {object} CompilerConfig
 * @property {CompilerOutputConfig} output
 * @property {boolean} minifyScripts
 * @property {string} libraryPath
 */

/**
 * @typedef {object} CompilerOutputConfig
 * @property {IndexTagsConfig} index
 */

/**
 * @typedef {object} IndexTagsConfig
 * @property {string} [title] website title
 * @property {string} [icon] website icon
 * @property {string} [description] website description
 * @property {string} [themeColor] hex color of website
 * @property {string} [author] creator of website
 * @property {string[]} [keywords] tags of website
 * @property {string[]} [robots] instruction to robots about website crawling
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

module.exports = {
    Config: {}, 
    CompilerConfig: {},
    CompilerOutputConfig: {},
    IndexTagsConfig: {},
    IndexSocialMediaTagsConfig: {},
    IndexTwitterTagsConfig: {}
}