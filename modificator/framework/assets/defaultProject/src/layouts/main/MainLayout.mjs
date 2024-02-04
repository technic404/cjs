import {ContainerComponent} from "../components/container/ContainerComponent.mjs";

export const MainLayout = new CjsLayout(
    [
        [ContainerComponent]
    ]
);

MainLayout.onLoad(() => {
    console.log('MainLayout loaded!')
});