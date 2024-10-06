const express = require('express');
const { Server } = require('http');
const { getRecursivelyDirectoryFiles, slashesToBackslashes, backslashesToSlashes } = require('./utils/fileUtil');
const { cjsConfig } = require('../../constants');

class TempWebServer {
    /** @type {number} */
    #port = cjsConfig.getUser().compiler.tempWebServerPort;
    
    /** @type {Server} */
    #server;

    /** @type {Function} */
    #app;

    /** @type {string[]} */
    htmlRoutes = [];

    /** @type {(url: string) => void} */
    #onLoad = () => {};

    /**
     * @param {string} directory containing the website assets
     */
    constructor(directory) {
        this.#app = express();

        this.#app.use(express.json())
        this.#app.use(express.static(directory));

        for(const htmlFilePath of getRecursivelyDirectoryFiles(directory, ".html")) {
            const htmlRoute = htmlFilePath.replace(slashesToBackslashes(directory), "");

            this.htmlRoutes.push(backslashesToSlashes(htmlRoute));

            this.#app.get(htmlRoute, (req, res) => {
                res.sendFile(`${directory}${htmlRoute}`);
            });
        }

        this.#server = this.#app.listen(this.#port, async () => {
            this.#onLoad(`http://localhost:${this.#port}`);
            
        });
    }

    /**
     * Executes when web server has been loaded
     * @param {(url: string) => void} callback 
     * @returns {TempWebServer}
     */
    onLoad(callback) {
        this.#onLoad = callback;

        return this;
    }

    close() {
        if(!this.#server) return;

        this.#server.close(() => {});
    }

    /**
     * Creates listetning endpoint, that when called will return request details
     * @param {"post"|"get"|"delete"|"options"|"patch"} method 
     * @param {string} endpoint 
     * @returns {Promise<{ body: object, query: Object.<string, string>, headers: Object.<string, string> }>}
     */
    async listenOn(method, endpoint) {
        return await new Promise((res, rej) => {
            this.#app[method](endpoint, (req, _) => {
                res({
                    body: req.body,
                    query: req.query,
                    headers: req.headers
                });
            });
        });
    }
}

module.exports = TempWebServer;