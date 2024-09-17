const CjsRunnableStyleWatcher = new Map();

/**
 * Css parser that splits selectors and its css contents
 * @param {string} css 
 * @returns {Object.<string, string>}
 */
function readRules(css) {
    const rules = {};
    const splitted = css.split("");
    let isBracketOpened = false;
    let isCommentOpened = false;
    let isStringOpened = false;
    let stringOpeningChar = '';
    let nestedBrackets = 0;
    let skipChars = 0;
    let tempText = '';
    let selector = '';

    const replaceNewLines = (str) => { return str.replaceAll("\n", ""); }
    
    for(let i = 0; i < splitted.length; i++) {
        const char = splitted[i];
        const nextChar = splitted.length > i + 1 ? splitted[i + 1] : null;
        
        if(skipChars > 0) {
            skipChars--;
            continue;
        }

        if(char === "*" && nextChar === "/" && isCommentOpened) {
            isCommentOpened = false;
            skipChars = 1;
            continue;
        } 

        if(isCommentOpened) continue;

        if(isStringOpened && char === stringOpeningChar) {
            isStringOpened = false;
            stringOpeningChar = '';
            tempText += char;
            continue;
        }

        if((char === "\"" || char === "'") && !isStringOpened) {
            isStringOpened = true;
            stringOpeningChar = char;
        }

        if((char === "/" && nextChar === "*") && !isStringOpened) {
            isCommentOpened = true;
            continue;
        }
        
        if(char === '{' && !isBracketOpened && !isStringOpened) {
            isBracketOpened = true;
            selector = replaceNewLines(tempText);
            tempText = '';

            if(!(selector in rules)) rules[selector] = '';
            
            continue;
        }

        if(!isBracketOpened) { tempText += char; continue; }
        
        if(char === '{' && isBracketOpened && !isStringOpened) { nestedBrackets++; }

        if(char === '}' && nestedBrackets > 0 && !isStringOpened) {
            nestedBrackets--;
            tempText += char;
            continue;
        }

        if(char === '}' && nestedBrackets === 0 && !isStringOpened) {
            rules[selector] = replaceNewLines(tempText);
            selector = '';
            tempText = '';
            isBracketOpened = false;
            continue;
        }

        tempText += char;
    }

    return rules;
}

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

/**
 *
 * @param {string} cssText
 * @param {string} prefix
 * @param {CjsStyleImportOptions} options
 * @return {Promise<string>}
 */
async function addPrefixToSelectors(cssText, prefix, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }) {
    const rules = readRules(cssText);

    let newRules = [];

    for (const [selector, cssText] of Object.entries(rules)) {
        const fullCssText = `${selector} { ${cssText} }`;
        const isMediaRule = selector.startsWith("@media");
        const isKeyFrameRule = selector.startsWith("@keyframes");

        if(isMediaRule) {
            const parsedRules = [];
            const rule = parseCSSRule(fullCssText);

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

        if (isKeyFrameRule) {
            const fullCssText = `${selector} { ${cssText} }`;

            newRules.push([fullCssText]);
            continue;
        }

        if (options.prefixStyleRules) {
            if(selector.startsWith(":")) {
                newRules.push([fullCssText]);
                continue;
            }

            const modifiedSelectors = selector.split(',').map(sel => {
                const selectorFirstChar = sel.trim().substring(0, 1);
                const isSelectorNotClassOrId = selectorFirstChar !== "." && selectorFirstChar !== "#";
                const selectors = [`${prefix}${(isSelectorNotClassOrId ? ` `: '')}${sel.trim()}`];

                if(options.enableMultiSelector) {
                    if(!isSelectorNotClassOrId) {
                        selectors.push(`${prefix} > * ${sel.trim()}`);
                        selectors.push(`${prefix} > ${sel.trim()}`);
                    } else {
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
                }

                return selectors;
            });

            modifiedSelectors.forEach(modifiedSelector => {
                const modifiedRule = `${modifiedSelector.join(", ")} { ${cssText} }`;

                newRules.push([modifiedRule]);
            })

            continue;
        }

        newRules.push([cssText]);
    }

    return newRules.map(e => e[0]).join('\n');
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