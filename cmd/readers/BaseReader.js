/**
 * Class ment to be implemented into other readers.
 * 
 * Detects basic comment checks and provides text with or without it.
 */
class BaseReader {
    comment = {
        enabled: true,
        opening: "<!--",
        closing: "-->",
        ignoreInString: false,
    }

    loop = {
        comment: {
            opened: false,
        },
        string: {
            openingChar: "",
            opened: false
        },
        skipChars: 0,
        char: "",
        text: ""
    }

    /**
     * String to analyze input
     * @param {string} source 
     */
    constructor(source) {
        this.source = source;
    }

    /**
     * @param {[]} array 
     * @param {number} index 
     * @returns {boolean}
     */
    _isOutOfBounds(array, index) {
        return array.length <= index + 1;;
    }

    /**
     * Checks if string chars is one by one next chars in the array
     * @param {string} toMatch 
     * @param {[]} array 
     * @returns {boolean}
     */
    _matchNextChars(toMatch, array) {
        const nextCommentChars = toMatch.split("");
        for(let j = 0; j < nextCommentChars.length; j++) {
            const nextCommentChar = nextCommentChars[j];
            const nextStringCharIndex = j;

            if(this._isOutOfBounds(array, nextStringCharIndex)) return false;

            const nextStringChar = array[nextStringCharIndex];

            if(nextStringChar !== nextCommentChar) return false;
        }

        return true;
    }

    /**
     * Reads string ignoring the comments sections with checks if the comment is in string to exclude comment or include comment
     * @example <div attr="Hello<!-- world -->"></div>
     * @description 
     * Everything from example above will be included
     * Other scenario when comment in string check is disabled, then this div will be readen like this:
     * @example <div attr="Hello"></div>
     * @param {(char: string) => void} callback 
     * @returns {string}
     */
    _read(callback = () => {}) {
        const { comment, loop } = this;
        const splitted = this.source.split("");
        let text = '';

        for(let i = 0; i < splitted.length; i++) {
            loop.char = splitted[i];
            
            if(loop.skipChars > 0) {
                loop.skipChars--;
                continue;
            }

            if(comment.enabled && this._matchNextChars(comment.closing, splitted.slice(i)) && loop.comment.opened) {
                loop.comment.opened = false;
                loop.skipChars = comment.closing.length - 1;
                continue;
            }

            if(loop.comment.opened) continue;

            if(loop.string.opened && loop.char === loop.string.openingChar) {
                loop.string.opened = false;
                loop.string.openingChar = '';
                text += loop.char;
                continue;
            }

            if((loop.char === "\"" || loop.char === "'") && !loop.string.opened) {
                loop.string.opened = true;
                loop.string.openingChar = loop.char;
            }

            if(comment.enabled && this._matchNextChars(comment.opening, splitted.slice(i))) {
                if(loop.string.opened && comment.ignoreInString) {
                    text += loop.char;
                    continue;
                }

                loop.comment.opened = true;
                continue;
            }

            text += loop.char;
        }

        for(const char of text.split("")) callback(char);

        return text;
    }
}

module.exports = BaseReader;