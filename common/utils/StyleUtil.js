/** @DeleteOnJsFormat */ const CssReader = require("../readers/CssReader");
/** @DeleteOnJsFormat */ const CssStylePropertiesReader = require("../readers/CssStylePropertiesReader");

/** @DeleteOnJsFormat */ const CjsDebug = { Style: { Media: [] } }
/** @DeleteOnJsFormat */ const CJS_PRETTY_PREFIX_X = '', CJS_STYLE_PREFIX = '';

const CjsCssMultisupportProperties = {
    "backdrop-filter": [
        "-webkit-backdrop-filter"
    ]
}

const CjsStyle = {
    RootVariables: {
        /**
         * Adds properties to RootVariable object
         * @param {Object.<string, string>} properties 
         */
        _addProperties: (properties) => {
            for(const [name, value] of Object.entries(properties)) {
                CjsStyle.RootVariables[name.trim()] = value;
            }
        }
    },
    /**
     * Adds style to website
     * @param {string} path 
     */
    importStyle: async (path) => {
        const request = await new CjsRequest(path, "get").doRequest();

        if(request.isError()) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`);
        }

        const text = request.text();
        const style = document.head.querySelector(`[id="${CJS_STYLE_PREFIX}"]`);

        style.innerHTML += addPrefixToSelectors(text);
    }
}

/**
 * @param {string} cssText
 * @param {string} prefix
 * @param {CjsStyleImportOptions} options
 * @return {string}
 */
function addPrefixToSelectors(cssText, prefix = '', options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }) {
    const rules = new CssReader(cssText).read();

    let newRules = [];

    const getModifiedRules = (selector, cssText) => {
        selector = selector.trim();
        const fullCssText = `${selector} { ${cssText} }`;

        if(selector.startsWith(":")) {
            const isRoot = selector.startsWith(":root");

            if(isRoot) {
                const properties = new CssStylePropertiesReader(cssText).read();

                CjsStyle.RootVariables._addProperties(properties);
            }

            return [fullCssText];
        }

        return selector.split(',').map(sel => {
            const selectorFirstChar = sel.trim().substring(0, 1);
            const isSelectorClassOrId = selectorFirstChar === "." || selectorFirstChar === "#";
            const selectors = [`${prefix}${(isSelectorClassOrId ? '': ' ')}${sel.trim()}`];
            
            // if(options.enableMultiSelector) {
            //     // selectors.push(`${prefix} > * ${sel.trim()}`);
            //     selectors.push(`${prefix} ${sel.trim()}`);
            // }

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
            const properties = new CssStylePropertiesReader(cssText).read();

            for(const [name, value] of Object.entries(properties)) {
                if(!(name in CjsCssMultisupportProperties)) continue;

                for(const multisupportPropertyName of CjsCssMultisupportProperties[name]) {
                    if(multisupportPropertyName in properties) continue;

                    properties[multisupportPropertyName] = value;
                }
            }

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
            const isVariable = value.startsWith("var(") && value.endsWith(")");
            const mapping = {};

            if(isVariable) { // TODO, var() and calc() support inside @media (min-width: var(--variable-name))
                const variableName = value.slice(4, -1);

                if(!(variableName in CjsStyle.RootVariables)) {
                    console.log(`${CJS_PRETTY_PREFIX_X} @range selector error, used variable "${variableName}" that is not defined in none of the :root scopes`);
                    continue;
                }

                const variableValue = CjsStyle.RootVariables[variableName];

                mapping["<"] = `max-width: ${variableValue}`;
                mapping["<="] = `max-width: ${variableValue}`; // TODO, not exacly true
                mapping[">"] = `min-width: ${variableValue}`;
                mapping[">="] = `min-width: ${variableValue}`; // TODO, not excaly true
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

    return newRules.join(' ').replaceAll("\n", "");
}

/** @DeleteOnJsFormat */ module.exports = { addPrefixToSelectors };