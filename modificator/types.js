/**
 * @typedef {object} Config
 * @property {string} version
 * @property {CompilerConfig} compiler
 * @property {ProjectStructureConfig} projectStructure
 */

/**
 * @typedef {object} ProjectStructureConfig
 * @property {ProjectStructureTypes} type
 */

/**
 * @typedef {"layoutTree"|"componentTree"} ProjectStructureTypes
 */

/**
 * @typedef {object} ProjectInitOptions
 * @property {ProjectStructureTypes} projectStructureType
 */

/**
 * @typedef {object} CompilerConfig
 * @property {CompilerOutputConfig} output
 * @property {boolean} minifyScripts
 * @property {string} libraryPath
 * @property {number} tempWebserverPort
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

/**
 * @typedef {object} CjsCreatorNames
 * @property {string} camelStyle
 * @property {string} pascalCase
 */

/**
 * @typedef {object} CjsCommandFlags
 * @property {string} target used to determinate where create part
 * If target is not set the part will be global in area of:
 * - `layout`, if the `superGlobal` flag is `false`
 * - `./src/parts`, if the `superGlobal` flag is `true` or the `projectStructure`.`type` in config is set to `layoutTree`
 * 
 * If target is set the part will be in area of:
 * - `component`, provided as a target value
 * @property {string} layout used to determinate where create a component or part 
 * 
 * (needed only when the `projectStructure.type` in config is set to `layoutTree`)
 * @property {boolean} superGlobal used to determinate the `target` property
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