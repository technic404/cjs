import { CjsGlobalStyleKeyframesTagId } from "../constants";
import { _CjsGlobalStyleUtil } from "../utils/protected/_CjsGlobalStyleUtil";
import { _CjsLoggerUtil } from "../utils/protected/_CjsLoggerUtil";

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
        for (const [selector, rules] of Object.entries(styleRules)) {
            const css = `${selector} { ${rules.join(" ")} }`;

            _CjsGlobalStyleUtil.appendStyle(`\n${css}`);
        }
    }
}