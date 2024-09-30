const BaseReader = require("./BaseReader");

class CssReader extends BaseReader {
    comment = {
        enabled: true,
        opening: "/*",
        closing: "*/",
        ignoreInString: true,
    }

    /**
     * Css text
     * @param {string} source 
     */
    constructor(source) {
        super(source);
    }

    /**
     * Provides xml tags with its attributes
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

module.exports = CssReader;