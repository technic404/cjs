/** @DeleteOnJsFormat */ const BaseReader = require("./BaseReader");

class XmlReader extends BaseReader {
    comment = {
        multipleLineEnabled: true,
        opening: "<!--",
        closing: "-->",
        ignoreInString: true,
        singleLineEnabled: true,
    }

    /**
     * Xml text
     * @param {string} source 
     */
    constructor(source) {
        super(source);
    }

    /**
     * Provides xml tags with its attributes
     * @returns {{ name: string, attributes: Object.<string, string> }[]}
     */
    read() {
        /** @type {{ name: string, attributes: Object.<string, string> }[]} */
        const tags = [];
        const tag = { name: '', attributes: {} };
        let tagOpened = false;
        let isClosingSection = false;
        let tagAttributesReading = false;
        let temp = '';
        let nestedLessThan = 0;

        this._read((char) => {
            const loop = this.loop;

            if(isClosingSection && char === '>') {
                isClosingSection = false;
                tagOpened = false;
                return;
            }

            if(isClosingSection) {
                return;
            }

            if(char === '<' && tagOpened) {
                nestedLessThan++;
            }

            if(char === '>' && !loop.string.opened && tagOpened && nestedLessThan === 0) {
                const attributes = (() => {
                    const attributes = {};

                    if(temp.trim().length === 0) return {};

                    const attrChars = temp.endsWith("/") ? temp.split("").slice(0, -1) : temp.split("");

                    let attrName = '';
                    let findAttrValueStart = false;
                    let attrValueStartChar = '';
                    let attrValue = '';

                    for(const attrChar of attrChars) {
                        if(attrChar === attrValueStartChar) {
                            attrValueStartChar = '';
                            attributes[attrName] = attrValue;
                            attrName = '';
                            attrValue = '';
                            continue;
                        }

                        if(attrValueStartChar !== '') {
                            attrValue += attrChar;
                            continue;
                        }

                        if(attrChar === " " && attrValueStartChar === '') {
                            attrName = attrName.trim();

                            if(attrName.length > 0) attributes[attrName] = '';
                            
                            attrName = '';
                            continue;
                        }

                        if(attrChar === "=" && attrValueStartChar === '') {
                            findAttrValueStart = true;
                            attrName = attrName.trim();
                            continue;
                        }

                        if(findAttrValueStart && attrValueStartChar === '') {
                            if(["\"", "'"].includes(attrChar)) {
                                attrValueStartChar = attrChar;
                                findAttrValueStart = false;
                                continue;
                            }

                            continue;
                        }

                        attrName += attrChar;
                    }

                    if(attrName.length > 0) attributes[attrName] = '';

                    return attributes;
                })();

                tag.attributes = Object.assign({}, attributes);

                tags.push(Object.assign({}, tag));
                
                tag.name = '';
                tag.attributes = {};
                
                temp = '';
                tagOpened = false;
                tagAttributesReading = false;
                return;
            }

            if(char === '>' && nestedLessThan > 0) {
                nestedLessThan--;
            }

            if(tagOpened) {
                if(tag.name === '' && ["/", "!"].includes(char)) {
                    isClosingSection = true;
                    return;
                }

                if(char === ' ' && !tagAttributesReading) {
                    tagAttributesReading = true;
                    return;
                }

                if(tagOpened && tagAttributesReading) {
                    temp += char;
                    return;
                }

                tag.name += char;
                return;
            }

            if(char === '<' && !loop.string.opened) {
                tagOpened = true;
                return;
            }
        });

        return tags.map(tag => {
            tag.name = tag.name.toLowerCase();

            return tag;
        });
    }
}

/** @DeleteOnJsFormat */ module.exports = XmlReader;