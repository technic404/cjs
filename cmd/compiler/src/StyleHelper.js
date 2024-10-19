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

const StyleHelper = {
    /**
     * @param {string} cssText
     * @param {string} prefix
     * @param {CjsStyleImportOptions} options
     * @return {string}
     */
    addPrefixToSelectors(cssText, prefix, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true }) {
        const rules = readRules(cssText);

        let newRules = [];

        const getModifiedRules = (selector, cssText) => {
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
            const isEmptyRule = cssText.trim() === '';

            if(isEmptyRule) continue;
            
            const isMediaRule = selector.startsWith("@media");
            const isKeyFrameRule = selector.startsWith("@keyframes");

            if(isMediaRule) {
                const modifiedRulesInside = (() => {
                    const rules = readRules(cssText);
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
}

module.exports = StyleHelper;