
/**
 * Utility providing various functions that support windows managing
 */
const CjsWindow = {
    /**
     * Opens url within new tab
     * @param {string} href 
     * @param {"_blank"|"_self"|"_parent"|"_top"} target _blank is default
     */
    open(href, target = "_blank") {
        const a = htmlToElement(`<a href="${href}" target="${target}"></a>`);
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
};