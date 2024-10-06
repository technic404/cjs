/**
 * Inits a webpage by a provided layout scheme
 * @param {CjsLayout} layout
 */
function init(layout) {
    const sleep = async (ms) => await new Promise((res) => { setTimeout(() => { res() }, ms) });

    const loadStartMs = new Date().getTime();

    document.head.appendChild(document.createComment("Styles"));

    document.addEventListener('DOMContentLoaded', async (e) => {
        if(document.getElementById(CJS_ROOT_CONTAINER_PREFIX) !== null) {
            document.getElementById(CJS_ROOT_CONTAINER_PREFIX).remove();
        }
        
        await sleep(10); // avoid conflict between ChangesObserver

        /* Cjs body root */
        const container = createContainer(CJS_ROOT_CONTAINER_PREFIX);
        const rootLayoutElement = layout.toElement();

        container.innerHTML = ``;
        container.insertAdjacentElement(`beforeend`, rootLayoutElement);

        layout._executeOnLoad();

        functionMappings.applyBodyMappings(); // loaded only on init of RootLayout

        console.log(`${CJS_PRETTY_PREFIX_V}Website loaded in ${Colors.Green}${new Date().getTime() - loadStartMs} ms${Colors.None}.`)
    });
}

function createContainer(id) {
    const container = document.createElement("div");
    container.setAttribute("id", id);

    document.body.appendChild(container);

    return container;
}