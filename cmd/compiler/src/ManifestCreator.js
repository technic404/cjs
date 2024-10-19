const { cjsConfig } = require("../../constants");
const { mergeObjects } = require("../../framework/utils/objects");

const ManifestCreator = {
    /**
     * Provides content of the `manifest.json` file
     * @returns {string}
     */
    getContent() {
        const { pages, globalPagesSettings } = cjsConfig.getUser().compiler
        /** @type {import("../../types").IndexTagsConfig} */
        const config = mergeObjects(globalPagesSettings, "index" in pages ? pages["index"] : {});
        const manifest = {
            short_name: config.title,
            name: config.shortTitle,
            icons: [], // todo
            start_url: ".",
            display: "standalone",
            theme_color: config.themeColor,
            background_color: config.backgroundColor
        }

        return JSON.stringify(manifest, null, 2);
    }
}

module.exports = ManifestCreator;