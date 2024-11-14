const CjsRunnableStyleWatcher = new Map();

/**
 *
 * @param {string} cssText
 * @param {string} prefix
 * @param {CjsStyleImportOptions} options
 * @return {Promise<string>}
 */
async function addPrefixToSelectors(cssText, prefix, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }) {
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
        const isMediaRule = selector.startsWith("@media");
        const isKeyFrameRule = selector.startsWith("@keyframes");
        const isRangeRule = selector.startsWith("@range"); // @range > 450px

        if(isRangeRule) {
            const parts = selector.split(" ");
            const determiner = parts[1];
            const value = parts[2];
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

            const mapping = {
                "<": `max-width: ${number - 1}`,
                "<=": `max-width: ${number}`,
                ">": `min-width: ${number + 1}`,
                ">=": `min-width: ${number}`
            }

            const addMappingUnits = (() => {
                for(const [k, v] of Object.entries(mapping)) {
                    mapping[k] = v + unit;
                }
            });

            addMappingUnits();

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

/**
 *
 * @param {string} selectorPrefix
 * @param {string} path
 * @param {CjsStyleImportOptions} options
 */
async function addRootStyle(selectorPrefix, path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
    if(!("prefixStyleRules" in options)) { options.prefixStyleRules = true; }
    if(!("encodeKeyframes" in options)) { options.encodeKeyframes = true; }
    if(!("enableMultiSelector" in options)) { options.enableMultiSelector = true; }
    
    if(cjsRunnable.isStyleValid()) return CjsRunnableStyleWatcher.set(selectorPrefix, { options, path }); 

    const request = await new CjsRequest(path, "get").doRequest();

    if(request.isError()) {
        return console.log(`${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`);
    }

    const text = request.text();
    const style = document.head.querySelector(`[id="${CJS_STYLE_PREFIX}"]`);
    const prefixed = await addPrefixToSelectors(text, `[${selectorPrefix}]`, options);

    style.innerHTML += prefixed;
}