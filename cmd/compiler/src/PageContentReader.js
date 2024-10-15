const fs = require('fs');
const { PrefixError } = require('../../defaults');
const { getRecursivelyDirectoryFiles, backslashesToSlashes } = require('./utils/fileUtil');

const PageContentReader = {
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
    getInitHtmlContentScript(srcDirectory, tempWebServerAddress, workerMap) {
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
            const layoutCompiledName = workerMap.get(path).setUpFunctionName;

            return `
                ${index}: async () => {
                    await init(${layoutCompiledName}().${basename});
                    
                    new CjsRequest("${tempWebServerAddress}/content", "post")
                    .setBody({
                        route: \`${backslashesToSlashes(path).replace("../src/pages/", "").replace(`${basename}.mjs`, `\${${layoutCompiledName}().${basename}.basename}`)}\`,
                        html: document.body.innerHTML,
                        progressed: {
                            count: ${index + 1},
                            total: ${paths.length},
                            isLast: ${isLast}
                        }
                    })
                    ${!isLast ? `.onEnd(() => CjsInitPages[${index + 1}]())` : `.onEnd(() => window.close()  )`}
                    .doRequest();
                }
            `
        }).join(",\n")}
        };

        sleep(100).then(() => CjsInitPages[0]());
        `;
    }
}

module.exports = PageContentReader;