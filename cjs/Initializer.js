/**
 * Inits a webpage by a provided layout scheme
 * @param {CjsLayout} layout
 */
function init(layout) {
    const sleep = async (ms) => await new Promise((res) => { setTimeout(() => { res() }, 10) });

    const loadStartMs = new Date().getTime();

    document.head.appendChild(document.createComment("Styles"));

    document.addEventListener('DOMContentLoaded', async (e) => {
        await sleep(3); // avoid conflict between ChangesObserver

        /* Cjs body root */
        const container = createContainer(CJS_ROOT_CONTAINER_PREFIX);
        const mainLayoutElement = layout.toElement();

        container.innerHTML = ``;
        container.insertAdjacentElement(`beforeend`, mainLayoutElement);

        layout._executeOnLoad();

        functionMappings.applyBodyMappings(); // loaded only on init of MainLayout

        console.log(`${CJS_PRETTY_PREFIX_V}Website loaded in ${Colors.Green}${new Date().getTime() - loadStartMs} ms${Colors.None}.`)
    });
}

function createContainer(id) {
    const container = document.createElement("div");
    container.setAttribute("id", id);

    document.body.appendChild(container);

    return container;
}