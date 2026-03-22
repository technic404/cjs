
export const _StringHTMLElementsUtil = {
    injectAttribute(html: string, attribute: string, value: string): string {
        const len = html.length;
        let i = 0;

        // Skip whitespace
        while (i < len && html.charCodeAt(i) <= 32) i++;

        if (html[i] !== "<") return html;

        const tagStart = i;
        const tagEnd = html.indexOf(">", tagStart);
        if (tagEnd === -1) return html;

        let openingTag = html.slice(tagStart, tagEnd);

        // Regex to safely find attribute (handles spaces + quotes)
        const attrRegex = new RegExp(
            `\\b${attribute}\\s*=\\s*(['"])(.*?)\\1`,
            "i"
        );

        const match = openingTag.match(attrRegex);

        let newOpeningTag: string;

        if (match) {
            const fullMatch = match[0];
            const quote = match[1];
            const existing = match[2].trim();

            const merged =
                existing.length === 0
                    ? value
                    : existing.endsWith(";")
                    ? existing + value
                    : attribute === "style"
                    ? existing + "; " + value
                    : existing + " " + value;

            const updatedAttr = `${attribute}=${quote}${merged}${quote}`;

            newOpeningTag = openingTag.replace(fullMatch, updatedAttr);
        } else {
            // Insert before closing (handle self-closing tags)
            const insertPos = openingTag.endsWith("/")
                ? openingTag.length - 1
                : openingTag.length;

            newOpeningTag =
                openingTag.slice(0, insertPos) +
                ` ${attribute}="${value}"` +
                openingTag.slice(insertPos);
        }

        return html.slice(0, tagStart) + newOpeningTag + html.slice(tagEnd);
    }
}