import { CjsIntersectionListener } from "./IntersectionListener";
import { CjsMutationListener } from "./MutationListener";

export const mutationListener = new CjsMutationListener();
export const insertionListener = new CjsIntersectionListener();

mutationListener.onAdd((element: Element) => {
    insertionListener.observe(element);
});

window.addEventListener("DOMContentLoaded", () => {
    insertionListener.observeAll();

    mutationListener.observe();
    mutationListener.executeAll("add");
});