import { ContainerHandler as Handler } from "./ContainerHandler.mjs";

export const ContainerComponent = new CjsComponent((data) => `
    <div class="container"></div>
`);

ContainerComponent.importStyle('./src/components/container/ContainerStyle.css');