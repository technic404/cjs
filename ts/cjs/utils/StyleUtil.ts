import { CJS_PRETTY_PREFIX_X, CJS_STYLE_PREFIX } from "../Constants";
import { Colors } from "../utils/ConsoleColorsUtil";
import { addPrefixToSelectors } from "../utils/StyleUtil";
import { CjsRequest } from "../utils/public/CjsRequestsUtil";

type CjsStyleImportOptions = {
    prefixStyleRules?: boolean;
    encodeKeyframes?: boolean;
    enableMultiSelector?: boolean;
};

type CjsRunnableStyleWatcherEntry = {
    options: CjsStyleImportOptions;
    path: string;
};

export const CjsRunnableStyleWatcher = new Map<string, CjsRunnableStyleWatcherEntry>();

export async function addRootStyle(
    selectorPrefix: string,
    path: string,
    options: CjsStyleImportOptions = {
        prefixStyleRules: true,
        encodeKeyframes: true,
        enableMultiSelector: true
    }
): Promise<void> {

    if (!("prefixStyleRules" in options)) options.prefixStyleRules = true;
    if (!("encodeKeyframes" in options)) options.encodeKeyframes = true;
    if (!("enableMultiSelector" in options)) options.enableMultiSelector = true;

    if (cjsRunnable.isStyleValid()) {
        CjsRunnableStyleWatcher.set(selectorPrefix, { options, path });
        return;
    }

    path = path.startsWith("./") ? path.slice(2) : path;

    const request = await new CjsRequest(path, "get").doRequest();

    if (request.isError()) {
        console.log(
            `${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`
        );
        return;
    }

    const text = request.text();

    const style = document.head.querySelector<HTMLStyleElement>(
        `[id="${CJS_STYLE_PREFIX}"]`
    );

    if (!style) return;

    const prefixed = addPrefixToSelectors(text, `[${selectorPrefix}]`, options);

    style.innerHTML += prefixed;
}