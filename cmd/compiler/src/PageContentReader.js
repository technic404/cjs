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

        /**
         * @param {{ layoutCompiledName: string, basename: string, route: string, index: number }} data 
         * @returns {string}
         */
        const getInnitorContent = (data) => {
            const { layoutCompiledName, basename, route, index } = data

            const pathsTotalSize = paths.length + 1; // + index.html
            const isLast = index + 1 >= pathsTotalSize;

            return `
            async () => {
                await init(${layoutCompiledName}().${basename});

                Array.from(document.body.querySelectorAll("*")).forEach(element => {
                    const attributes = getAttributeStartingWith(element, CJS_PREFIX);

                    attributes.forEach(attribute => {
                        element.removeAttribute(attribute);
                    });
                });

                new CjsRequest("${tempWebServerAddress}/content", "post")
                .setBody({
                    route: \`${route}\`,
                    html: document.body.innerHTML,
                    progressed: {
                        count: ${index + 1},
                        total: ${pathsTotalSize},
                        isLast: ${isLast}
                    }
                })
                ${!isLast ? `.onEnd(() => CjsInitPages[${index + 1}]())` : `.onEnd(() => { console.log('[Debug] Finished Compilation'); })`}
                .doRequest();
            }
            `
        }
        
        return `
        const CjsInitPages = {
            0: ${getInnitorContent({
                    layoutCompiledName: workerMap.get("..\\src\\layouts\\root\\RootLayout.mjs").setUpFunctionName,
                    basename: "RootLayout",
                    route: "index",
                    index: 0
                })},
            ${paths.map((path, index) => {
                const layoutCompiledName = workerMap.get(path).setUpFunctionName;
                const basename = getBasename(path);
                const route = backslashesToSlashes(path).replace("../src/pages/", "").replace(`${basename}.mjs`, `\${${layoutCompiledName}().${basename}.basename}`);
    
                return `${index + 1}: ` + getInnitorContent({
                    layoutCompiledName,
                    basename,
                    route,
                    index: index + 1
                });
            }).join(",\n")}
        };
        
        window.addEventListener('DOMContentLoaded', () => CjsInitPages[0]());

        //sleep(1000).then(() => CjsInitPages[0]());
        `;
    }
}

module.exports = PageContentReader;