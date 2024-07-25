const xml2js = require('xml2js');
const { PrefixError } = require('../../../defaults');

const CjsStyler = {
    /**
     * Returns html elements selectors (parent included) inside provided html
     * @param {string} html 
     * @returns {Promise<string[]>}
     */
    async getSelectors(html) {
        const fixSelfClosingTags = (xml) => {
            const selfClosingTags = [
                'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
                'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
            ];

            const selfClosingTagsRegex = new RegExp(`<(${selfClosingTags.join('|')})([^>]*)>`, 'gi');

            xml = xml.replace(selfClosingTagsRegex, (match, tag, attributes) => {
                if (match.endsWith('/>')) return match;
                
                return `<${tag}${attributes} />`;
            });

            return xml;
        }

        let isSyntaxError = false;

        const fixedXmlString = fixSelfClosingTags(`<root>${html}</root>`);

        xml2js.parseString(fixedXmlString, (err, result) => {
            if(err) {
                console.log(`${PrefixError}There is an error in your html syntax`);

                isSyntaxError = true;
            }
        });

        if(isSyntaxError) return [];

        const result = await xml2js.parseStringPromise(fixedXmlString);
        const root = result.root;

        const extract = (object) => {
            const tagName = Object.keys(object)[0];

            const hasData = typeof object[tagName][0] === 'object'
            const attributes = object[tagName].length === 1 && hasData && "$" in object[tagName][0]
                    ? object[tagName][0]["$"]
                    : {}
            const className = "class" in attributes ? attributes.class : null;
            const children = [];

            if(hasData) {
                for(const [key, value] of Object.entries(object[tagName][0])) {
                    if(key === "$" || key === "_") continue;

                    const data = { [key]: value };
                    const dataTagName = Object.keys(data)[0];

                    for(const tagData of data[dataTagName]) {
                        const temp = { [dataTagName]: [tagData] };

                        children.push(extract(temp));
                    }
                }
            }

            return { tag: tagName, class: className, children }
        }

        const selectors = (() => {
            const array = [];
            const hierarchy = extract(root);

            /** @param {{ tag: string, class: string|null, children: [] }} data */
            const traverse = (data, parentSelector) => {
                let selector = parentSelector !== null ? `${parentSelector} > ` : ''

                selector += data.class !== null
                    ? `.${data.class}`
                    : `${data.tag}`

                array.push(selector);

                for(const child of data.children) {
                    traverse(child, selector);
                }
            }

            traverse(hierarchy, null);

            return array;
        })();

        return selectors;
    }
}

module.exports = CjsStyler;