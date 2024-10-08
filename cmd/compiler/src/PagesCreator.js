const fs = require('fs');
const { PrefixError } = require('../../defaults');
const { getRecursivelyDirectoryFiles } = require('./utils/fileUtil');

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
        
        return paths.map(path => {
            return `
            init(${getBasename(path)});
            new CjsRequest("${tempWebServerAddress}/content", "post")
            .setBody({

            })
            ` 
        });        
    }
}

module.exports = PagesCreator;