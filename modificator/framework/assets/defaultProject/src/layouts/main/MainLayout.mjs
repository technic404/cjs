import {Container} from "./Container.mjs";

export const MainLayout = new CjsLayout(
    [
        [Container]
    ]
);

MainLayout.onLoad(() => {
    console.log('MainLayout loaded!')
});