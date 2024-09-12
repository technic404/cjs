const CjsRunnableStyleWatcher = new Map();

/**
 *
 * @param {string} cssRuleText
 * @return {Promise<CSSRule>}
 */
async function parseCSSRule(cssRuleText) {
    return await new Promise(((resolve, reject) => {
        const styleSheet = new CSSStyleSheet();
        styleSheet.insertRule(cssRuleText);

        return resolve(styleSheet.cssRules[0]);
    }))
}

async function addUniqueKeyframes(keyframesRules, rules) {
    let newRules = [...rules];

    for(const keyframesRule of keyframesRules) {
        const { rule, originalAnimationName } = keyframesRule;

        for(const newRuleObject of newRules) {
            const newRule = newRuleObject[0];

            if(newRule.startsWith('@') && !newRule.startsWith('@media')) continue; // @keyframes

            let parsed = await parseCSSRule(newRule);

            const targetStyles = (parsed instanceof CSSMediaRule ? Array.from(parsed.cssRules) : [parsed]);

            targetStyles.forEach(cssRule => {
                const style = cssRule.style;

                if(style.animationName !== originalAnimationName) {
                    if(style.animation === "") return;

                    let split = style.animation.split(" ");

                    if(split[0] !== originalAnimationName) return;

                    split[0] = rule.name;

                    style.animation = split.join(" ");
                } else {
                    style.animationName = rule.name;
                }
            })

            newRules = newRules.filter(e => e[0] !== newRule);

            newRules.push([parsed.cssText]);
        }
    }

    return newRules;
}

/**
 *
 * @param {string} cssText
 * @param {string} prefix
 * @param {CjsStyleImportOptions} options
 * @return {Promise<string>}
 */
async function addPrefixToSelectors(cssText, prefix, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);

    let cssRules = Array.from(sheet.cssRules);

    let newRules = [];
    let keyframesRules = [];

    for (let rule of cssRules) {
        if (rule instanceof CSSStyleRule && options.prefixStyleRules) {
            const selectorText = rule.selectorText;

            if(selectorText.startsWith(":")) {
                newRules.push([rule.cssText]);
                continue;
            }

            const modifiedSelectors = selectorText.split(',').map(sel => {
                const selectorFirstChar = sel.trim().substring(0, 1);
                const isSelectorNotClassOrId = selectorFirstChar !== "." && selectorFirstChar !== "#";
                const selectors = [`${prefix}${(isSelectorNotClassOrId ? ` `: '')}${sel.trim()}`];

                if(options.enableMultiSelector) {
                    if(!isSelectorNotClassOrId) {
                        selectors.push(`${prefix} > * ${sel.trim()}`);
                        selectors.push(`${prefix} > ${sel.trim()}`);
                    } else {
                        // Selector like button[cjsAttribute] { ... }
                        const selectorTextSplit = selectorText.split(" ");
                        const firstTag = selectorTextSplit[0];
                        const restSelector = selectorTextSplit.slice(1).join(" ");

                        // like button:before or button::before

                        const colonSelector = firstTag.includes(":") ? firstTag.slice(firstTag.indexOf(":")) : "";

                        selectors.push(`${firstTag.replace(colonSelector, "")}${prefix}${colonSelector} ${restSelector}`);

                    }
                }

                return selectors;
            });

            modifiedSelectors.forEach(modifiedSelector => {
                const modifiedRule = `${modifiedSelector.join(", ")} { ${rule.style.cssText} }`;

                newRules.push([modifiedRule]);

                // console.log(rule);
                // console.log(modifiedRule);
            })

            continue;
        }

        if(rule instanceof CSSMediaRule) {
            const parsedRules = [];

            Array.from(rule.cssRules).forEach(cssRule => {
                const selectorText = cssRule.selectorText;

                const modifiedSelectors = selectorText.split(',').map(sel => {
                    const selectorFirstChar = sel.trim().substring(0, 1);
                    const isSelectorNotClassOrId = selectorFirstChar !== "." && selectorFirstChar !== "#";
                    const selectors = [`${prefix}${(isSelectorNotClassOrId ? ` `: '')}${sel.trim()}`];

                    if(options.enableMultiSelector) {
                        if(!isSelectorNotClassOrId) {
                            selectors.push(`${prefix} > * ${sel.trim()}`)
                        }
                    }

                    return selectors;
                });

                modifiedSelectors.forEach(modifiedSelector => {
                    const modifiedRule = `${modifiedSelector.join(", ")} { ${cssRule.cssText.replace(selectorText, "").replace("{", "").replace("}", "")} }`;

                    parsedRules.push(modifiedRule);
                });
            });

            const conditionText = rule.conditionText;

            newRules.push([`@media ${conditionText} { ${parsedRules.join("\n")} }`, parsedRules]);

            continue;
        }

        if (rule instanceof CSSKeyframesRule && options.encodeKeyframes) {
            const animationName = rule.name;
            const newAnimationName = `${getRandomCharacters(CJS_ID_LENGTH)}-_${animationName}`;

            rule.name = newAnimationName;

            keyframesRules.push({ rule: rule, originalAnimationName: animationName });
            newRules.push([rule.cssText]);

            continue;
        }

        console.log([rule.cssText]);

        newRules.push([rule.cssText]);
    }

    const parsedRules = await addUniqueKeyframes(keyframesRules, newRules);

    return parsedRules.map(e => e[0]).join('\n');
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