/** @DeleteOnJsFormat */ const BaseReader = require("./BaseReader");

class CssReader extends BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "/*",
        closing: "*/",
        ignoreInString: true,
        singleLineEnabled: false,
    }

    /**
     * Css text
     * @param {string} css 
     */
    constructor(css) {
        super(css);
    }

    /**
     * Provides selector with its contents
     * @returns {Object.<string, string>}
     */
    read() {
        const rules = {};
        let isBracketOpened = false;
        let nestedBrackets = 0;
        let tempText = '';
        let selector = '';

        const replaceNewLines = (str) => { return str.replaceAll("\n", ""); }

        this._read((char) => {
            const loop = this.loop;
            
            if(char === '{' && !isBracketOpened && !loop.string.opened) {
                isBracketOpened = true;
                selector = replaceNewLines(tempText);
                tempText = '';
    
                if(!(selector in rules)) rules[selector] = '';
                
                return;
            }
    
            if(!isBracketOpened) { tempText += char; return; }
            
            if(char === '{' && isBracketOpened && !loop.string.opened) { nestedBrackets++; }
    
            if(char === '}' && nestedBrackets > 0 && !loop.string.opened) {
                nestedBrackets--;
                tempText += char;
                return;
            }
    
            if(char === '}' && nestedBrackets === 0 && !loop.string.opened) {
                rules[selector] = replaceNewLines(tempText);
                selector = '';
                tempText = '';
                isBracketOpened = false;
                return;
            }
    
            tempText += char;
        });
    

        return rules;
    }
}

/** @DeleteOnJsFormat */ module.exports = CssReader;