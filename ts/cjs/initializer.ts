import { CjsLayout } from "cjs";
import { CjsRootTag } from "./constants";
import { CjsMutationListener } from "./listeners/CjsMutationListener";


export function init(layout: CjsLayout) {
    const root = document.body.querySelector(CjsRootTag);

    if(!root) {
        document.body.appendChild(document.createElement(CjsRootTag));
        return init(layout);
    }

    root.innerHTML = "";

    for(const element of layout.visualise()) {
        root.appendChild(element);
    }

    window.addEventListener('DOMContentLoaded', _ => {

    Array.from(document.body.querySelectorAll("*")).forEach(e => {
        CjsMutationListener.processElementEvents(e);
    });

        CjsMutationListener.observe();
    });
}