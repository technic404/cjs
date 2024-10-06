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

        console.log(`${CJS_PRETTY_PREFIX_V}Website loaded in ${Colors.Green}${new Date().getTime() - loadStartMs} ms${Colors.None}.`);

        if(cjsRunnable.isCompiled()) {
            console.log(`http://localhost:${cjsRunnable.getTempWebServerPort()}/content`);
            
            new CjsRequest(`http://localhost:${cjsRunnable.getTempWebServerPort()}/content`, "post")
                .setBody({ 
                    html: document.body.innerHTML, 
                    route: (() => {
                        const url = new URL(window.location.href);
                        const pathname = url.pathname;
                        
                        return pathname.startsWith("/") ? pathname.substring(1) : pathname;
                    })()
                })
                .doRequest();
        }
    });
}

function createContainer(id) {
    const container = document.createElement("div");
    container.setAttribute("id", id);

    document.body.appendChild(container);

    return container;
}