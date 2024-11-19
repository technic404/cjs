const CjsRunnableStyleWatcher = new Map();

/**
 *
 * @param {string} selectorPrefix
 * @param {string} path
 * @param {CjsStyleImportOptions} options
 */
async function addRootStyle(selectorPrefix, path, options = { prefixStyleRules: true, encodeKeyframes: true, enableMultiSelector: true } ) {
    if(!("prefixStyleRules" in options)) { options.prefixStyleRules = true; }
    if(!("encodeKeyframes" in options)) { options.encodeKeyframes = true; }
    if(!("enableMultiSelector" in options)) { options.enableMultiSelector = true; }
    
    if(cjsRunnable.isStyleValid()) return CjsRunnableStyleWatcher.set(selectorPrefix, { options, path }); 

    const request = await new CjsRequest(path, "get").doRequest();

    if(request.isError()) {
        return console.log(`${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`);
    }

    const text = request.text();
    const style = document.head.querySelector(`[id="${CJS_STYLE_PREFIX}"]`);
    const prefixed = addPrefixToSelectors(text, `[${selectorPrefix}]`, options);

    style.innerHTML += prefixed;
}