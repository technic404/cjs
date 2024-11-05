/**
 * Class ment to be implemented into other readers.
 * 
 * Detects basic comment checks and provides text with or without it.
 */
class BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "<!--",
        closing: "-->",
        ignoreInString: true,
        singleLineEnabled: false,
        singleLine: "//"
    }

    stringChars = [
        "\"", "'"
    ]

    loop = {
        comment: {
            multipleLineOpened: false,
            singleLineOpened: false
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
     * @param {boolean} logNext 
     * @returns {boolean}
     */
    _matchNextChars(toMatch, array, logNext = false) {
        if(toMatch === undefined) return false;

        const chars = toMatch.split("");

        if(logNext) console.log(`Comparsion: "${toMatch}" with "${array.slice(0, toMatch.length).join("")}"`);

        const charByChar = [];

        const logCharByChar = () => {
            if(!logNext) return;

            console.log("Char by char comparsion:", charByChar.map(e => `"${e.matchChar}" ${e.matchChar === e.arrayChar ? "==" : "!="} "${e.arrayChar}"`).join(", "));
        }

        for(let j = 0; j < chars.length; j++) {
            const char = chars[j];
            const nextStringCharIndex = j;

            if(this._isOutOfBounds(array, nextStringCharIndex)) {
                logCharByChar();
                return false;
            }

            const nextStringChar = array[nextStringCharIndex];

            charByChar.push({ matchChar: char, arrayChar: nextStringChar });

            if(nextStringChar !== char) {
                logCharByChar();
                return false;
            }
        }

        logCharByChar();

        return true;
    }

    /**
     * Reads string ignoring the comments sections with checks if the comment is in string to exclude comment or include comment
     * @example <div attr="Hello<!-- world -->"></div>
     * @description 
     * Everything from example above will be included
     * Other scenario when comment in string check is disabled, then this div will be readen like this:
     * @example <div attr="Hello"></div>
     * @param {(char: string, index: number, matchNextChars: (text: string, logNext?: boolean) => boolean) => void} callback 
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

            if(comment.multipleLineEnabled && this._matchNextChars(comment.closing, splitted.slice(i)) && loop.comment.multipleLineOpened) {
                loop.comment.multipleLineOpened = false;
                loop.skipChars = comment.closing.length - 1;
                continue;
            }

            if(comment.singleLineEnabled && loop.comment.singleLineOpened && this._matchNextChars("\n", splitted.slice(i))) {
                loop.comment.singleLineOpened = false;
                loop.skipChars = 1;
                continue;
            }

            if(loop.comment.multipleLineOpened || loop.comment.singleLineOpened) continue;

            if(loop.string.opened && loop.char === loop.string.openingChar) {
                loop.string.opened = false;
                loop.string.openingChar = '';
                text += loop.char;
                continue;
            }

            if(this.stringChars.includes(loop.char) && !loop.string.opened) {
                loop.string.opened = true;
                loop.string.openingChar = loop.char;
            }

            if(comment.singleLineEnabled && this._matchNextChars(comment.singleLine, splitted.slice(i)) && !loop.string.opened) {
                loop.comment.singleLineOpened = true;
                continue;
            }

            if(comment.multipleLineEnabled && this._matchNextChars(comment.opening, splitted.slice(i))) {
                if(loop.string.multipleLineOpened && comment.ignoreInString) {
                    text += loop.char;
                    continue;
                }

                loop.comment.multipleLineOpened = true;
                continue;
            }

            text += loop.char;
        }

        const textSplit = text.split("");

        const passCallback = (char, i) => {
            callback(char, i, (toMatch, logNext = false) => {
                if(toMatch === undefined) return false;

                return this._matchNextChars(toMatch, textSplit.slice(i), logNext);
            });
        }
        
        for(let i = 0; i < textSplit.length; i++) {
            const char = textSplit[i];

            if(loop.string.opened && char === loop.string.openingChar) {
                loop.string.opened = false;
                loop.string.openingChar = '';

                passCallback(char, i);
                continue;
            }

            if(this.stringChars.includes(char) && !loop.string.opened) {
                loop.string.opened = true;
                loop.string.openingChar = char;

                passCallback(char, i);
                continue;
            }

            passCallback(char, i);
        }

        return text;
    }
}

/** @DeleteOnJsFormat */ module.exports = BaseReader;