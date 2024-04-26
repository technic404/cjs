const express = require('express');
const { exec } = require('child_process');
const { Server } = require('http');
const fs = require('fs');
const app = express();

/**
 * @type {Server}
 */
let server = null;

/**
 * 
 * @param {Number} port 
 * @param {String} scriptContent 
 * @param {function(string, string, string)} callback 
 */
async function startWebServer(port, scriptContent, callback = function() {}) {
    return await new Promise((resolve, reject) => {
        app.use(express.json());

        app.get('/', (req, res) => {
            fs.writeFileSync(`${__dirname}/public/temp/script.js`, scriptContent);

            res.send(
                fs.readFileSync(`${__dirname}/public/index.html`, { encoding: 'utf-8' })
                .replace("{SCRIPT_CONTENT}", scriptContent)
                .replace("{WORKER_CONTENT}", fs.readFileSync(`${__dirname}/public/script.js`, { encoding: 'utf-8' }))
            );
        });
    
        app.post("/closeServer", (req, res) => {

            res.status(200).json({ message: "closing" })
            stopWebServer();

            resolve();
        })
    
        app.post(`/submit`, (req, res) => {
            const data = req.body;
        
            if(!("fileUrl" in data) || !("result" in data) || !("prefix" in data)) {
                reject("Malformed request in /submit post");

                return res.status(500).json({ message: `Not found 'fileUrl', 'result' or 'prefix' in body` })
            }
    
            callback(data.fileUrl, data.result, data.prefix);
    
            res.status(200).json({ v: "ok" })
        });
    
        server = app.listen(port, () => {
            const url = `http://localhost:${port}`;
    
            const command = process.platform === 'win32'
                ? `start ${url}`
                : process.platform === 'darwin'
                ? `open ${url}`
                : `xdg-open ${url}`;
    
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject("Cannot open the browser window", error);
                }
            });
        });
    })
}

function stopWebServer() {
    if(server === null) return;

    server.close(() => {
        // console.log('Server is terminated');
    });
}

module.exports = {
    startWebServer,
}