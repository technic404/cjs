import { CjsIntersectionListener } from "./IntersectionListener";
import { CjsMutationListener } from "./MutationListener";

const mutationListener = new CjsMutationListener();
const insertionListener = new CjsIntersectionListener();

mutationListener.onAdd((element: Element) => {
    insertionListener.observe(element);
});

window.addEventListener("DOMContentLoaded", () => {
    insertionListener.observeAll();

    mutationListener.observe();

    mutationListener.executeAll("add");
});