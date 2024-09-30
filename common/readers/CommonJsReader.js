const BaseReader = require("./BaseReader");

class CommonJsReader extends BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "/*",
        closing: "*/",
        ignoreInString: true,
        singleLineEnabled: true,
        singleLine: "//",
    }

    /**
     * CommonJs script content
     * @param {string} script 
     */
    constructor(script) {
        super(script);
    }

    read() {
        let content = '';
        const assigments = {};
        const assigmentTypes = ["var", "let", "const"];
        let nestedBrackets = 0;
        let readingVariable = false;
        let variableContent = '';
        let variableType = '';

        this._read((char, checkNextChars) => {
            const loop = this.loop;

            
            if(readingVariable && ((() => {
                for(const k of [";", ...assigmentTypes]) { 
                    if(checkNextChars(k)) return true;
                }
                return false;
            })() && !loop.string.opened)) {
                readingVariable = false;

                const varParsedContent = variableContent.slice(variableType.length);
                const varSplit = varParsedContent.split("=").map(e => e.trim());
                const varName = varSplit[0];
                const varContent = varSplit[1];

                assigments[varName] = {
                    type: variableType,
                    content: varContent
                };

                variableType = '';
                variableContent = '';
            }

            for(const assigment of assigmentTypes) {
                if(checkNextChars(`${assigment} `)) {
                    console.log('found', assigment);

                    readingVariable = true;
                    variableType = assigment;
                    return;
                }
            }


            if(readingVariable) {
                variableContent += char;
            }

            content += char;
        });

        console.log(assigments);
        
        return content;
    }
}

console.log(new CommonJsReader(`
const CjsRipple = new CjsRipplePlugin();
const CjsNotification = new CjsNotificationPlugin();
const CjsScaleClick = new CjsScaleClickPlugin();
const fs = require('fs');

const CjsPluginManager = {
    /**
     * 
     * @param {{ ripple?: boolean, notification?: boolean, scaleClick?: boolean }} plugins 
     */
    enable(plugins) {
        const mapping = {
            ripple: CjsRipple,
            notification: CjsNotification,
            scaleClick: CjsScaleClick
        }
        
        for(const [key, value] of Object.entries(plugins)) {
            const parsedKey = key.trim();
            // test line
            console.log('abc');

            if(!(parsedKey in mapping)) continue;

            /** @type {CjsPlugin} */
            const plugin = mapping[parsedKey];

            if(value) plugin.enable();
        }
    },
}
`).read())