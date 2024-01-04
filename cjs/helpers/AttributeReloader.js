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
            part: getAttributeStartingWith(child, CJS_PART_PREFIX),
            partTextField: getAttributeStartingWith(child, CJS_PART_TEXT_FIELD_PREFIX),
            element: getAttributeStartingWith(child, CJS_ELEMENT_PREFIX),
            references: getAttributeStartingWith(child, CJS_REFERENCE_PREFIX)
        }

        /*
        for(const [key, value] of Object.entries(attributes)) {
            value.forEach(a => child.removeAttribute(a));
        }

        attributes.component.forEach(a => {
            child.setAttribute(COMPONENT_PREFIX + getRandomCharacters(ID_LENGTH), "")
        });

        attributes.part.forEach(a => {
            child.setAttribute(PART_PREFIX + getRandomCharacters(ID_LENGTH), "")
        });

        attributes.partTextField.forEach(a => {
            child.setAttribute(PART_TEXT_FIELD_PREFIX + getRandomCharacters(ID_LENGTH), "")
        });
        */

        attributes.references.forEach(a => {
            //child.removeAttribute(a);
        })

        attributes.element.forEach(a => {
            child.removeAttribute(a);

            if(functionMappings.mappings.has(a)) {
                const newAttribute = functionMappings.cloneMapping(a);

                child.setAttribute(newAttribute.trim(), "");
            }
        });

        attributes.element.forEach(a => {
            //functionMappings.mappings.delete(a);
        })
    }

    return element.outerHTML;
}