const Tag = require("./tags/Tag");

/**
 * 
 * @param {{htmlAttributes?: { name: string, value: string }[], head?: Tag[], body?: Tag[]}} data 
 * @returns {String} html string
 */
function createHtmlStructure(data) {
    if(!("htmlAttributes" in data)) data.htmlAttributes = [];
    if(!("head" in data)) data.head = [];
    if(!("body" in data)) data.body = [];

    const htmlAttributes = data.htmlAttributes.map(e => `${e.name}="${e.value}"`).join(" ")

    let html = `<!DOCTYPE html>\n<html ${htmlAttributes}>\n`;

    html += `    <head>\n`;

    for(const tag of data.head) {
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

    for(const tag of data.body) {
        const tagName = tag.tagName;
        const text = ("text" in tag ? tag.text : '');
        const attributes = ("attributes" in tag ? tag.attributes : []);
        const parsedAttributes = attributes.length > 0 ? " " + attributes.map(e => `${e.name}="${e.value}"`).join(" ") : '';

        html += `        <${tagName}${parsedAttributes}>${text}</${tagName}>`;
    }

    html += `    </body>\n`;
    html += `</html>`;

    return html;
}

module.exports = {
    createHtmlStructure
}