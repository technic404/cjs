import { CJS_PRETTY_PREFIX_X, CJS_STYLE_PLUGINS_PREFIX } from "../Constants";

/**
 * Base class for all plugins
 */
export abstract class CjsPlugin {

    /**
     * Enables the plugin
     */
    abstract enable(): void;

    /**
     * Adds CSS style rules to plugin style container
     */
    protected _addStyleRules(styleRules: Record<string, string[]>): void {
        const style = document.getElementById(
            CJS_STYLE_PLUGINS_PREFIX
        ) as HTMLStyleElement | null;

        if (!style) {
            console.warn(`${CJS_PRETTY_PREFIX_X} Plugin style element not found`);
            return;
        }

        for (const [selector, rules] of Object.entries(styleRules)) {
            const css = `${selector} { ${rules.join(" ")} }`;

            style.innerHTML += `\n${css}`;
        }
    }
}