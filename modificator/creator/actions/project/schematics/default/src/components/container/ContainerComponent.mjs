import { ContainerHandler } from "./ContainerHandler.mjs";

const Handler = new ContainerHandler();

export const ContainerComponent = createComponent(`
    <div class="container"></div>
`);

ContainerComponent.importStyle('./src/components/container/ContainerStyle.css');