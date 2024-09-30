const XmlReader = require('../../../common/readers/XmlReader');

const IndexHeadReader = {
    getECMAScriptsSources(html) {
        const tags = new XmlReader(html).read();
        
        const ECMAModules = tags
            .filter(e => 
                e.name === "script" 
                && "type" in e.attributes 
                && "src" in e.attributes 
                && e.attributes.type === "module"
            );

        return ECMAModules.map(e => e.attributes.src)
    }
}

module.exports = IndexHeadReader;