
export const _StringHTMLElementsUtil = {
    injectAttribute(html: string, attribute: string, value: string): string {
        const len = html.length;
        let i = 0;

        while (i < len && html.charCodeAt(i) <= 32) i++;

        if (html[i] !== "<") return html;

        const tagStart = i;
        const tagEnd = html.indexOf(">", tagStart);

        if (tagEnd === -1) return html;

        const openingTag = html.slice(tagStart, tagEnd);
        const attributeIndex = openingTag.indexOf(`${attribute}=`);
        const attributeExistsInHTML = attributeIndex !== -1;
        const attributeLength = attribute.length;

        let newOpeningTag: string;

        if (attributeExistsInHTML) {
            const quote = openingTag[attributeIndex + attributeLength];
            const start = attributeIndex + attributeLength + 1;
            const end = openingTag.indexOf(quote, start);
            const existing = openingTag.slice(start, end).trim();
            const merged =
                !existing.endsWith(";") && existing.length > 0
                    ? existing + ";" + value
                    : existing + value;

            newOpeningTag =
                openingTag.slice(0, start) +
                merged +
                openingTag.slice(end);
        } else {
            newOpeningTag = openingTag + ` ${attribute}="${value}"`;
        }

        return html.slice(0, tagStart) + newOpeningTag + html.slice(tagEnd);
    }
}