const mutationListener = new CjsMutationListener();
const insertionListener = new CjsIntersectionListener();

mutationListener._onAdd((node) => {
    insertionListener.observe(node);
});

window.addEventListener('DOMContentLoaded', () => {
    insertionListener.observeAll();

    mutationListener.observe();
    mutationListener.executeAll("add");
});