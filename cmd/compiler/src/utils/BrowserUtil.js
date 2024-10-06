const { exec } = require('child_process');

/**
 * Open browser with provided url
 * @param {string} url
 */
function openUrl(url) {
    const command = process.platform === 'win32'
        ? `start ${url}`
        : process.platform === 'darwin'
        ? `open ${url}`
        : `xdg-open ${url}`;

    exec(command, (error) => {
        if(error) console.log("Cannot open the browser window", error);
    });
}

module.exports = {
    openUrl
}