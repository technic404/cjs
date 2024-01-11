/**
 *
 * @param {LayoutLoader} layout
 */
function init(layout) {
    const loadStartMs = new Date().getTime();

    document.head.appendChild(document.createComment("Styles"))

    /* Style root */
    createStyle(CJS_STYLE_PREFIX);

    /* Filters style */
    createStyle(CJS_STYLE_FILTERS_PREFIX);

    /* KeyFrames style */
    createStyle(CJS_STYLE_KEYFRAMES_PREFIX);

    document.addEventListener('DOMContentLoaded', async (e) => {
        /* Cjs body root */
        const container = createContainer(CJS_ROOT_CONTAINER_PREFIX);
        const mainLayoutElement = layout.getLayout().getLayoutElement();

        container.innerHTML = ``;
        container.insertAdjacentElement(`beforeend`, mainLayoutElement);

        layout.loadLayoutMappings();

        functionMappings.applyBodyMappings(); // loaded only on init of MainLayout

        console.log(`${CJS_PRETTY_PREFIX_V}Website loaded in ${Colors.Green}${new Date().getTime() - loadStartMs} ms${Colors.None}.`)
    });
}

function createStyle(id) {
    const style = document.createElement("style");
    style.setAttribute("id", id);

    document.head.appendChild(style);

    return style;
}

function createContainer(id) {
    const container = document.createElement("div");
    container.setAttribute("id", id);

    document.body.appendChild(container);

    return container;
}