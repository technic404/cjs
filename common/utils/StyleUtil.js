/** @DeleteOnJsFormat */ const CssReader = require("../readers/CssReader");

/** @DeleteOnJsFormat */ const CjsDebug = { Style: { Media: [] } }

/**
 * @param {string} cssText
 * @param {string} prefix
 * @param {CjsStyleImportOptions} options
 * @return {string}
 */
function addPrefixToSelectors(cssText, prefix, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }) {
    const rules = new CssReader(cssText).read();

    let newRules = [];

    const getModifiedRules = (selector, cssText) => {
        selector = selector.trim();
        const fullCssText = `${selector} { ${cssText} }`;

        if(selector.startsWith(":")) return [fullCssText];

        return selector.split(',').map(sel => {
            const selectorFirstChar = sel.trim().substring(0, 1);
            const isSelectorClassOrId = selectorFirstChar === "." || selectorFirstChar === "#";
            const selectors = [`${prefix}${(isSelectorClassOrId ? '': ' ')}${sel.trim()}`];

            if(!isSelectorClassOrId) {
                // Selector like button[cjsAttribute] { ... }
                const selectorTextSplit = selector.split(" ");
                const firstTag = selectorTextSplit[0];
                const rawRestSelector = selectorTextSplit.slice(1).join(" ");

                // like button:before or button::before
                const colonSelector = firstTag.includes(":") ? firstTag.slice(firstTag.indexOf(":")) : "";
                const parsedFirstTag = firstTag.replace(colonSelector, "");
                const restSelector = `${colonSelector} ${rawRestSelector}`;

                // like button:before, button:after
                const commaSeparatedRemainingSelectors = restSelector.split(",").map(e => e.trim()).slice(1);
                const commaSeparatedSelectors = restSelector.includes(",") ? commaSeparatedRemainingSelectors.map(e => {
                    const parts = [`${parsedFirstTag}${prefix}`, `${e.replace(parsedFirstTag, "")}`];
                    const createSpacing = !parts[1].startsWith(":");

                    return parts.join(createSpacing ? " " : "");
                }) : "";

                if(restSelector.includes(",")) {
                    selectors.push(`${parsedFirstTag}${prefix}${restSelector.replace(commaSeparatedRemainingSelectors, commaSeparatedSelectors)}`);
                } else {
                    selectors.push(`${parsedFirstTag}${prefix}${restSelector}`);
                }
            }

            return selectors;
        })
            .map(selectors => `${selectors.join(", ")} { ${cssText} }`)
            .flat();
    }

    const getModifiedRulesInside = ((selector, cssText) => {
        const rules = new CssReader(cssText).read();

        const newRules = [];

        for(const [selector, cssText] of Object.entries(rules)) {
            const modifiedRules = getModifiedRules(selector, cssText);

            newRules.push(...modifiedRules);
        }

        return newRules;
    });

    for (const [selector, cssText] of Object.entries(rules)) {
        const isEmptyRule = cssText.trim() === '';

        if(isEmptyRule) continue;

        const isMediaRule = selector.startsWith("@media");
        const isKeyFrameRule = selector.startsWith("@keyframes");
        const isRangeRule = selector.startsWith("@range"); // @range > 450px

        if(isRangeRule) {
            const parts = selector.split(" ");
            const determiner = parts[1];
            const value = parts[2];
            const isCalculativeExpression = (
                (value.startsWith("var(") || value.startsWith("calc("))
                && value.endsWith(")")
            );
            const mapping = {};

            if(isCalculativeExpression && false) { // TODO, var() and calc() support inside @media (min-width: var(--variable-name))
                mapping["<"] = `max-width: ${value}`;
                mapping["<="] = `max-width: ${value}`; // TODO, not exacly true
                mapping[">"] = `min-width: ${value}`;
                mapping[">="] = `min-width: ${value}`; // TODO, not excaly true
            } else {
                const valueParts = (() => {
                    let number = ``;
                    let unit = ``;
    
                    for(const char of value.split("")) {
                        if(isNaN(char)) {
                            unit += char;
                        } else {
                            number += char
                        }
                    }
    
                    return {
                        number: parseInt(number), unit
                    }
                })();
    
                const { number, unit } = valueParts;
    
                mapping["<"] = `max-width: ${number - 1}`;
                mapping["<="] = `max-width: ${number}`;
                mapping[">"] = `min-width: ${number + 1}`;
                mapping[">="] = `min-width: ${number}`;
    
                const addMappingUnits = (() => {
                    for(const [k, v] of Object.entries(mapping)) {
                        mapping[k] = v + unit;
                    }
                });
    
                addMappingUnits();
            }

            const mediaCss = `@media only screen and (${mapping[determiner]}) { ${getModifiedRulesInside(selector, cssText).join("\n")} }`;

            CjsDebug.Style.Media.push(mediaCss);

            newRules.push(mediaCss);

            continue;
        }

        if(isMediaRule) {
            const mediaCss = `${selector} { ${getModifiedRulesInside(selector, cssText).join("\n")} }`;

            CjsDebug.Style.Media.push(mediaCss);
            
            newRules.push(mediaCss);
            
            continue;
        }

        if (isKeyFrameRule) {
            const fullCssText = `${selector} { ${cssText} }`;

            newRules.push(fullCssText);
            continue;
        }

        if (options.prefixStyleRules) {
            const modifiedRules = getModifiedRules(selector, cssText);

            newRules.push(...modifiedRules);

            continue;
        }

        newRules.push(cssText);
    }

    return newRules.join('\n') + "\n";
}

/** @DeleteOnJsFormat */ module.exports = { addPrefixToSelectors };