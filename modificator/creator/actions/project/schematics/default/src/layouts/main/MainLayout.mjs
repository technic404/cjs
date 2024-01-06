import {ContainerComponent} from "../../components/container/ContainerComponent.mjs";

export const MainLayout = new LayoutLoader(createLayout(
    [
        [ContainerComponent]
    ]
));

MainLayout.onLoad(() => {
    console.log('MainLayout loaded!')
});