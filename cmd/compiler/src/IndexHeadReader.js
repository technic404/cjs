const XmlReader = require("../../readers/XmlReader");
const fs = require('fs');

/**
 * String parser
 * @param {string} string 
 * @param {{ comment: { opening: string, closing: string, ignoreInString: booleans } }} options
 * @returns {Object.<string, string>}
 */
function readRules(string, options = { comment: { opening: "<!--", closing: "-->", ignoreInString: true } }) {
    const commentExists = "comment" in options;
    const { comment } = options;
    const splitted = string.split("");
    let isCommentOpened = false;
    let isStringOpened = false;
    let stringOpeningChar = '';
    let skipChars = 0;
    let text = '';

    const replaceNewLines = (str) => { return str.replaceAll("\n", ""); }
    const isOutOfBounds = (num) => splitted.length <= num + 1;
    const matchNextChars = ((toMatch, fromIndex) => {
        const nextCommentChars = toMatch.split("");
        for(let j = 0; j < nextCommentChars.length; j++) {
            const nextCommentChar = nextCommentChars[j];
            const nextStringCharIndex = fromIndex + j;

            if(isOutOfBounds(nextStringCharIndex)) return false;

            const nextStringChar = splitted[nextStringCharIndex];

            if(nextStringChar !== nextCommentChar) return false;
        }

        return true;
    });
    
    for(let i = 0; i < splitted.length; i++) {
        const char = splitted[i];
        const nextChar = splitted.length > i + 1 ? splitted[i + 1] : null;
        
        if(skipChars > 0) {
            skipChars--;
            continue;
        }

        if(commentExists && matchNextChars(comment.closing, i)) {
            isCommentOpened = false;
            skipChars = comment.closing.length - 1;
            continue;
        }

        if(isCommentOpened) continue;

        if(isStringOpened && char === stringOpeningChar && comment.ignoreInString) {
            isStringOpened = false;
            stringOpeningChar = '';
            text += char;
            continue;
        }

        if((char === "\"" || char === "'") && !isStringOpened && comment.ignoreInString) {
            isStringOpened = true;
            stringOpeningChar = char;
        }

        if(commentExists && matchNextChars(comment.opening, i)) {
            isCommentOpened = true;
            continue;
        }

        text += char;
    }

    return text;
}

const IndexHeadReader = {
    getECMAScriptsSources(html) {
        const tags = new XmlReader(html).read();
        
        const ECMAModules = tags
            .filter(e => 
                e.name === "script" 
                && "type" in e.attributes 
                && "src" in e.attributes 
                && e.attributes.type === "module"
            );

        return ECMAModules.map(e => e.attributes.src)
    }
}

module.exports = IndexHeadReader;