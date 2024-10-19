const Tag = require("./objects/Tag");

class HtmlCreator {

    /**
     * Provides html content
     * @param {{htmlAttributes?: { name: string, value: string }[], head?: Tag[], body?: Tag[] | string}} structure 
     * @returns {string}
     */
    _getHtml(structure) {
        const keys = ["htmlAttributes", "head", "body"];

        for(const key of keys) {
            if(!(key in structure)) {
                structure[key] = [];
                continue;
            }
            
            structure[key] = Array.isArray(structure[key]) ? structure[key].flat() : structure[key];
        }

        const htmlAttributes = structure.htmlAttributes.map(e => `${e.name}="${e.value}"`).join(" ")

        let html = `<!DOCTYPE html>\n<html ${htmlAttributes}>\n`;

        html += `    <head>\n`;
        
        for(const tag of structure.head) {
            if(!tag) continue;

            const tagName = tag.tagName;
            const isNewLineSpace = tagName === null;

            if(isNewLineSpace) {
                html += `        <!-- -->\n`;
                continue;
            }
            
            const isNonClosingTag = ["meta", "link"].includes(tagName.toLowerCase());
            const attributes = ("attributes" in tag ? tag.attributes : []);
            const parsedAttributes = attributes.length > 0 ? " " + attributes.map(e => {
                let str = e.name;
                const hasEmptyValue = e.value === "";

                if(!hasEmptyValue) { str += `="${e.value}"`; }

                return str;
            }).join(" ") : '';
            const text = ("text" in tag ? tag.text : '');

            html += `        <${tagName}${parsedAttributes}${isNonClosingTag ? " /" : ""}>`;

            if(!isNonClosingTag) {
                html += `${text}</${tagName}>`
            }

            html += "\n";
        }

        html += `    </head>\n`;
        html += `    <body>\n`;

        if(typeof structure.body === 'string') {
            html += `        ${structure.body}\n`;
        } else {
            for(const tag of structure.body) {
                const tagName = tag.tagName;
                const text = ("text" in tag ? tag.text : '');
                const attributes = ("attributes" in tag ? tag.attributes : []);
                const parsedAttributes = attributes.length > 0 ? " " + attributes.map(e => `${e.name}="${e.value}"`).join(" ") : '';
    
                html += `        <${tagName}${parsedAttributes}>${text}</${tagName}>`;
            }
        }

        html += `    </body>\n`;
        html += `</html>`;

        return html;
    }
}

module.exports = HtmlCreator;