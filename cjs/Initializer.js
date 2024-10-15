
/**
 * Inits a webpage by a provided layout scheme
 * @param {CjsLayout|CjsPage} layout
 */
async function init(layout) {
    if(!(layout instanceof CjsLayout) && !(layout instanceof CjsPage)) {
        return console.log(`${CJS_PRETTY_PREFIX_X}Provided element in init() method is not CjsLayout or CjsPage`);
    }

    const sleep = async (ms) => await new Promise((res) => { setTimeout(() => { res() }, ms) });
    const loadStartMs = new Date().getTime();

    const removeRootIfExists = () => {
        const element = document.getElementById(CJS_ROOT_CONTAINER_PREFIX);

        if(element !== null) {
            element.remove();
            return;
        }

        document.head.appendChild(document.createComment("Styles"));
    }

    const loadLayout = async () => {
        removeRootIfExists();

        await sleep(10); // avoid conflict between ChangesObserver

        /* Cjs body root */
        const container = createContainer(CJS_ROOT_CONTAINER_PREFIX);
        const layoutElement = layout.toElement();

        container.innerHTML = ``;
        container.insertAdjacentElement(`beforeend`, layoutElement);

        layout._executeOnLoad();

        functionMappings.applyBodyMappings(); // loaded only on init of RootLayout

        console.log(`${CJS_PRETTY_PREFIX_V}Website loaded in ${Colors.Green}${new Date().getTime() - loadStartMs} ms${Colors.None}.`);
    }

    if(CjsGlobals.window.DOMContentLoaded) {
        await loadLayout();
        return;
    }

    document.addEventListener('DOMContentLoaded', async (e) => {
        await loadLayout();
    });
}

function createContainer(id) {
    const container = document.createElement("div");
    container.setAttribute("id", id);

    document.body.appendChild(container);

    return container;
}