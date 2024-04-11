const CjsConfig = require("./framework/objects/CjsConfig");

const cjsConfig = new CjsConfig();
const htmlClosingTags = [
    "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", 
    "bdo", "blackquote", "button", "canvas", "caption", "cite", "code", "col", 
    "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", 
    "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form",
    "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "i", "iframe", "ins", "label", 
    "legend", "li", "main", "mark", "menu", "nav", "ol", "optgroup", "option", "output", "p",
    "param", "pre", "progress", "q", "script", "search", "section", "select", "small",
    "span", "strong", "style", "summary", "sub", "table", "tbody", "td", "template",
    "textarea", "tfoot", "th", "thead", "time", "title", "tr", "u", "ul", "video"
];

module.exports = {
    cjsConfig: cjsConfig,
    htmlClosingTags: htmlClosingTags
}