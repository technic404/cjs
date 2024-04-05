/**
 * Reloads action attributes only
 * @param {string} html
 * @returns {string}
 */
function reloadAttributes(html) {
    const element = htmlToElement(html);

    for (const child of [element, ...element.querySelectorAll("*")]) {
        const attributes = {
            component: getAttributeStartingWith(child, CJS_COMPONENT_PREFIX),
            element: getAttributeStartingWith(child, CJS_ELEMENT_PREFIX),
            references: getAttributeStartingWith(child, CJS_REFERENCE_PREFIX)
        }

        attributes.element.forEach(a => {
            child.removeAttribute(a);

            if(functionMappings.mappings.has(a)) {
                const newAttribute = functionMappings.cloneMapping(a);

                child.setAttribute(newAttribute.trim(), "");
            }
        });
    }

    return element.outerHTML;
}