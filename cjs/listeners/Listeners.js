const mutationListener = new CjsMutationListener();
const insertionListener = new CjsIntersectionListener();

mutationListener._onAdd((node) => {
    insertionListener.observe(node);
});

window.addEventListener('DOMContentLoaded', () => {
    insertionListener.observell();

    mutationListener.observe();
    mutationListener.executeAll("add");
});