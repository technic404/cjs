import { ContainerHandler as Handler } from "./ContainerHandler.mjs";

export const ContainerComponent = createComponent(`
    <div class="container"></div>
`);

ContainerComponent.importStyle('./src/components/container/ContainerStyle.css');