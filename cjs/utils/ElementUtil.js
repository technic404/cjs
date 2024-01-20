/**
 *
 * @param {HTMLElement|Node} element
 * @param {string} startingWith
 * @returns {string[]} attribute name
 */
function getAttributeStartingWith(element, startingWith) {
    let attributes = [];

    if(!element.attributes) return [];

    for (const attribute of element.attributes) {
        const attributeName = attribute.name;

        if (attributeName.startsWith(startingWith)) {
            attributes.push(attributeName);
        }
    }

    return attributes;
}

function htmlToElement(html) {
    const template = document.createElement('template');

    template.innerHTML = html;

    if(template.content.children.length > 1) {
        console.log(`${CJS_PRETTY_PREFIX_X}Element have to contain parent element on the top, wrap your code in container like div`)
    }

    return template.content.firstElementChild;
}

/**
 * Creates a <virtualContainer> tag at the top of provided element
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function createVirtualContainer(element) {
    const virtualContainer = document.createElement("virtualContainer");

    virtualContainer.appendChild(element);

    return virtualContainer;
}

/**
 * Finds parent that has attribute starting with passed value
 * @param {HTMLElement} countFromElement
 * @param {string} attribute
 * @param {boolean} includeSelf
 * @return {null|HTMLElement}
 */
function findParentThatHasAttribute(countFromElement, attribute, includeSelf = true) {
    function hasAttribute(element) {
        return getAttributeStartingWith(element, attribute).length > 0;
    }

    if(includeSelf && hasAttribute(countFromElement)) return countFromElement;

    if(!countFromElement.parentElement) return null;

    let parent = countFromElement.parentElement;

    while (!hasAttribute(parent)) {
        if(!parent.parentElement) return null;

        parent = parent.parentElement;
    }

    return parent;
}