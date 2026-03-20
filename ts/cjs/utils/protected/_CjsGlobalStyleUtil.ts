import { CjsGlobalStyleTagId } from "../../constants";
import { _DOMElementsUtil } from "./_DOMElementsUtil";

let GlobalStyleCreated = false;

function create() {
    if(GlobalStyleCreated) return null;

    const styleElement = document.head.appendChild(
        _DOMElementsUtil.HTMLToElement(`<style id="${CjsGlobalStyleTagId}"></style>`)
    );

    GlobalStyleCreated = true;

    return styleElement;
}


export const _CjsGlobalStyleUtil = {
    create() {
        create()
    },
    appendStyle(cssText: string) {
        if(!GlobalStyleCreated) {
            (create() as HTMLElement).innerHTML += cssText;
            return;
        }

        const globalStyle = document.getElementById(CjsGlobalStyleTagId)!;

        globalStyle.innerHTML += cssText;
    }
}