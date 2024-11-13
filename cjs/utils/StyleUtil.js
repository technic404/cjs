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

    for (const [selector, cssText] of Object.entries(rules)) {
        const isMediaRule = selector.startsWith("@media");
        const isKeyFrameRule = selector.startsWith("@keyframes");

        if(isMediaRule) {
            const modifiedRulesInside = (() => {
                const rules = new CssReader(cssText).read();

                const newRules = [];

                for(const [selector, cssText] of Object.entries(rules)) {
                    const modifiedRules = getModifiedRules(selector, cssText);

                    newRules.push(...modifiedRules);
                }

                return newRules;
            })();

            const modifiedMedia = `${selector} { ${modifiedRulesInside.join("\n")} }`;

            newRules.push(modifiedMedia);
            
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