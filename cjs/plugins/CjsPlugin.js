class CjsPlugin {
    /**
     * Enables the plugin
     */
    enable() {}

    /**
     * Add styles to plugin styles
     * @param {Object.<string, string[]>} styleRules 
     */
    _addStyleRules(styleRules) {
        const style = document.getElementById(CJS_STYLE_PLUGINS_PREFIX);

        for(const [selector, rules] of Object.entries(styleRules)) {
            style.innerHTML += `${selector} { ${rules.join(" ")} }`;
        }
    }
}