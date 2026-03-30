import CssReader from "../../readers/CssReader";
import CssStylePropertiesReader from "../../readers/CssStylePropertiesReader";
import { _CSSRangeRule } from "./utilities/CSSRangeUtility";

const CjsCssMultisupportProperties: Record<string, string[]> = {
  "backdrop-filter": ["-webkit-backdrop-filter"],
};

export const _CSSProcessor = {
    processComponentStyle(prefix: string, cssText: string) {
        const rules = new CssReader(cssText).read();
        let newRules: string[] = [];

        const getModifiedRules = (selector: string, cssText: string): string[] => {
            selector = selector.trim();

            const fullCssText = `${selector} { ${cssText} }`;

            if (selector.startsWith(":")) {
                return [fullCssText];
            }

            return selector
                .split(",")
                .map((sel) => {
                    const selectorFirstChar = sel.trim().substring(0, 1);
                    const isSelectorClassOrId = selectorFirstChar === "." || selectorFirstChar === "#";

                    const selectors = [
                        `${prefix}${isSelectorClassOrId ? "" : " "}${sel.trim()}`,
                    ];

                    if (!isSelectorClassOrId) {
                        // Selector like button[cjsAttribute] { ... }
                        const selectorTextSplit = sel.split(" ");
                        const firstTag = selectorTextSplit[0];
                        const rawRestSelector = selectorTextSplit.slice(1).join(" ");

                        // like button:before or button::before
                        const colonSelector = firstTag.includes(":") ? firstTag.slice(firstTag.indexOf(":")) : "";
                        const parsedFirstTag = firstTag.replace(colonSelector, "");
                        const restSelector = `${colonSelector} ${rawRestSelector}`;

                        // like button:before, button:after
                        const commaSeparatedRemainingSelectors = restSelector.split(",").map((e) => e.trim()).slice(1);
                        const commaSeparatedSelectors = restSelector.includes(",")
                            ? commaSeparatedRemainingSelectors.map((e) => {
                                const parts = [
                                    `${parsedFirstTag}${prefix}`,
                                    `${e.replace(parsedFirstTag, "")}`,
                                ];
                                const createSpacing = !parts[1].startsWith(":");

                                return parts.join(createSpacing ? " " : "");
                            })
                            : "";

                        if (restSelector.includes(",")) {
                            selectors.push(
                                `${parsedFirstTag}${prefix}${restSelector.replace(
                                    commaSeparatedRemainingSelectors as any,
                                    commaSeparatedSelectors as any
                                )}`
                            );
                        } else {
                            selectors.push(`${parsedFirstTag}${prefix}${restSelector}`);
                        }
                    }

                    return selectors;
                })
                .map((selectors) => `${selectors.join(", ")} { ${cssText} }`)
                .flat();
        };

        const getModifiedRulesInside = (selector: string, cssText: string): string[] => {
            const rules = new CssReader(cssText).read();
            const newRules: string[] = [];

            for (const [selector, cssText] of Object.entries(rules)) {
                const properties = new CssStylePropertiesReader(cssText).read();

                for (const [name, value] of Object.entries(properties)) {
                    if (!(name in CjsCssMultisupportProperties)) continue;

                    for (const multisupportPropertyName of CjsCssMultisupportProperties[name]) {
                        if (multisupportPropertyName in properties) continue;

                        properties[multisupportPropertyName] = value;
                    }
                }

                const modifiedRules = getModifiedRules(selector, cssText);
                newRules.push(...modifiedRules);
            }

            return newRules;
        };

        for (const [_selector, cssText] of Object.entries(rules)) {
            if (cssText.trim() === "") continue;

            const selector = _selector.trim();
            const isMediaRule = selector.startsWith("@media");
            const isKeyFrameRule = selector.startsWith("@keyframes");
            const isRangeRule = selector.startsWith("@range");

            if (isRangeRule) {
                const rangeRuleSelector = _CSSRangeRule.processSelector(selector);
                const mediaCss = `${rangeRuleSelector} { ${getModifiedRulesInside(selector, cssText).join("\n")} }`;

                newRules.push(mediaCss);
                continue;
            }

            if (isMediaRule) {
                const mediaCss = `${selector} { ${getModifiedRulesInside(
                    selector,
                    cssText
                ).join("\n")} }`;

                newRules.push(mediaCss);
                continue;
            }

            if (isKeyFrameRule) {
                newRules.push(`${selector} { ${cssText} }`);
                continue;
            }

            const modifiedRules = getModifiedRules(selector, cssText);

            newRules.push(...modifiedRules);
        }

        return newRules.join(" ").replaceAll("\n", "");
    }
}