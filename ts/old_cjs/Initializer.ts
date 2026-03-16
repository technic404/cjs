import { CJS_PRETTY_PREFIX_V, CJS_PRETTY_PREFIX_X, CJS_ROOT_CONTAINER_PREFIX } from "./Constants";
import { functionMappings } from "./FunctionMappings";
import { CjsLayout } from "./objects/CjsLayout";
import { CjsPage } from "./objects/CjsPage";
import { Colors } from "./utils/ConsoleColorsUtil";
import { CjsGlobals } from "./utils/public/CjsGlobalsUtil";

/**
 * Inits a webpage by a provided layout scheme
 */
export async function init(layout: CjsLayout | CjsPage): Promise<void> {
    const sleep = async (ms: number): Promise<void> =>
        new Promise((res) => {
            setTimeout(res, ms);
        });

    const loadStartMs = Date.now();

    const removeRootIfExists = (): void => {
        const roots = Array.from(
            document.querySelectorAll<HTMLElement>(`#${CJS_ROOT_CONTAINER_PREFIX}`)
        );

        roots.forEach((root) => root.remove());

        document.head.appendChild(document.createComment("Styles"));
    };

    const loadLayout = async (): Promise<void> => {
        removeRootIfExists();

        await sleep(10); // avoid conflict between ChangesObserver

        /* Cjs body root */
        const container = createContainer(CJS_ROOT_CONTAINER_PREFIX);
        const layoutElement = layout.toElement() as HTMLElement;

        container.innerHTML = "";
        container.insertAdjacentElement("beforeend", layoutElement);

        layout._executeOnLoad({});

        functionMappings.applyBodyMappings();

        console.log(`${CJS_PRETTY_PREFIX_V}Website loaded in ${Colors.Green}${Date.now() - loadStartMs} ms${Colors.None}.`);
    };

    if (CjsGlobals.window.DOMContentLoaded) {
        await loadLayout();
        return;
    }

    document.addEventListener("DOMContentLoaded", async () => {
        await loadLayout();
    });
}

function createContainer(id: string): HTMLDivElement {
    const container = document.createElement("div");
    container.setAttribute("id", id);

    document.body.appendChild(container);

    return container;
}