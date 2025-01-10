const puppeteer = require('puppeteer');

/**
 * Open browser with provided url
 * @param {string} url
 * @returns {Promise<PuppeteerCore.Browser>}
 */
async function openUrl(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    return browser;
}

module.exports = {
    openUrl
}