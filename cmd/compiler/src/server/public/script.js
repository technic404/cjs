const CJS_ID_LENGTH = 16;

/**
 * To lower case (html naming friendly)
 * @param {Number} length
 * @returns {String}
 */
function getRandomCharacters(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.toLowerCase(); // lower case is html naming friendly
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    /**
     *
     * @param {String} string
     * @return {boolean}
     */
    const isFirstCharacterANumber = (string) => { return !isNaN(string.substring(0, 1)); }

    while (isFirstCharacterANumber(result)) {
        result = getRandomCharacters(length);
    }

    return result;
}

/**
 *
 * @param {String} cssRuleText
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
 * @param {String} cssText
 * @param {String} prefix
 * @param {Object} options
 * @param {Boolean} options.prefixStyleRules
 * @param {Boolean} options.encodeKeyframes
 * @param {Boolean} options.enableMultiSelector
 * @param {Boolean} includePrefixTypes
 * @return {Promise<string>}
 */
async function addPrefixToSelectors(cssText, prefix, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }, includePrefixTypes = false) {
    const PrefixTypes = {
        Basic: { type: "[attr].class", code: 1 },
        MultiUnder: { type: "[attr] > * .class", code: 2 },
        Under: { type: "[attr] > .class", code: 3 },
        KeyFrame: { type: "@keyframe", code: 4 },
        AfterTag: { type: "element[attr]", code: 5 }
    }

    function getFormattedPrefix(prefixType = null) {
        if(prefixType === null || !includePrefixTypes) return `[${prefix}]`;

        if(!("code" in prefixType)) return console.error(`Error, provided wrong prefixType`)

        return `[${prefix}-${prefixType.code}]`;
    }

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
                const isSelectorNotClassOrId = ![".", "#"].includes(selectorFirstChar);
                const isNotStarSelector = selectorFirstChar !== "*";
                const selectors = [`${getFormattedPrefix(PrefixTypes.Basic)}${(isSelectorNotClassOrId ? ` `: '')}${sel.trim()}`];

                if(options.enableMultiSelector) {
                    if(!isSelectorNotClassOrId) {
                        selectors.push(`${getFormattedPrefix(PrefixTypes.MultiUnder)} > * ${sel.trim()}`)
                        selectors.push(`${getFormattedPrefix(PrefixTypes.Under)} > ${sel.trim()}`)
                    } else if(isNotStarSelector) {
                        // Deny for selector like *[cjsAttribute]
                        // Selector like button[cjsAttribute] { ... }
                        const selectorTextSplit = selectorText.split(" ");
                        const firstTag = selectorTextSplit[0];
                        const restSelector = selectorTextSplit.slice(1).join(" ");

                        selectors.push(`${firstTag}${getFormattedPrefix(PrefixTypes.AfterTag)} ${restSelector}`)

                    }
                }

                return selectors;
            });

            modifiedSelectors.forEach(modifiedSelector => {
                const modifiedRule = `${modifiedSelector.join(", ")} { ${rule.style.cssText} }`;

                newRules.push([modifiedRule]);
            })

            continue;
        }

        if(rule instanceof CSSMediaRule) {
            const parsedRules = [];

            Array.from(rule.cssRules).forEach(cssRule => {
                const selectorText = cssRule.selectorText;

                const modifiedSelectors = selectorText.split(',').map(sel => {
                    const selectorFirstChar = sel.trim().substring(0, 1);
                    const isSelectorNotClassOrId = ![".", "#"].includes(selectorFirstChar);
                    const selectors = [`${getFormattedPrefix(PrefixTypes.Basic)}${(isSelectorNotClassOrId ? ` `: '')}${sel.trim()}`];

                    if(options.enableMultiSelector) {
                        if(!isSelectorNotClassOrId) {
                            selectors.push(`${getFormattedPrefix(PrefixTypes.MultiUnder)} > * ${sel.trim()}`)
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

        newRules.push([rule.cssText]);
    }

    const parsedRules = await addUniqueKeyframes(keyframesRules, newRules);

    return parsedRules.map(e => e[0]).join('\n');
}