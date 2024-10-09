const fs = require('fs');
const { PrefixError } = require('../../defaults');
const { getRecursivelyDirectoryFiles, backslashesToSlashes } = require('./utils/fileUtil');

const PagesCreator = {
    /**
     * Returns .mjs file paths from /src/pages
     * @param {string} srcDirectory 
     * @returns {string[]}
     */
    getPageFilesPaths(srcDirectory) {
        const pagesDirectory = `${srcDirectory}/pages`;

        if(!fs.existsSync(pagesDirectory)) {
            console.log(`${PrefixError}Pages directory does not exist`);
            return [];
        }

        return getRecursivelyDirectoryFiles(pagesDirectory, ".mjs");
    },
    getInitHtmlContent(srcDirectory, tempWebServerAddress) {
        const paths = this.getPageFilesPaths(srcDirectory);
        const getBasename = (filename) => {
            const base = filename.split(/[\\/]/).pop();
            
            return base.substring(0, base.lastIndexOf('.')) || base;
        }
        
        return `
        const CjsInitPages = {
            ${paths.map((path, index) => {
                const basename = getBasename(path);
                const isLast = index + 1 >= paths.length;

                return `
                    ${index}: () => {
                        init(${basename});
                        new CjsRequest("${tempWebServerAddress}/content", "post")
                        .setBody({
                            route: \`${backslashesToSlashes(path).replace("../src/pages/", "").replace(`${basename}.mjs`, `\${${basename}.basename}`)}\`,
                            html: document.body.innerHTML
                        })
                        ${!isLast ? `.onEnd(() => CjsInitPages[${index}]())` : ``}
                        .doRequest();
                    }
                ` 
            }).join(",\n")}
        }
        `     
    }
}

module.exports = PagesCreator;