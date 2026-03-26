import { CjsGlobalStyleTagId, CjsRootTag } from "./constants";
import { CjsMutationListener } from "./listeners/CjsMutationListener";
import { CjsLayout } from "./objects/CjsLayout";
import { _CjsGlobalStyleUtil } from "./utils/protected/_CjsGlobalStyleUtil";
import { _DOMElementsUtil } from "./utils/protected/_DOMElementsUtil";


export function init(layout: CjsLayout) {
    const root = document.body.querySelector(CjsRootTag);

    if(!root) {
        document.body.appendChild(document.createElement(CjsRootTag));
        return init(layout);
    }

    _CjsGlobalStyleUtil.create();

    root.innerHTML = "";

    CjsMutationListener.observe();

    for(const element of layout.visualise()) {
        root.appendChild(element);

        Array.from(element.querySelectorAll("*")).forEach(e => {
            CjsMutationListener.processElementEvents(e);
        });
    }
}