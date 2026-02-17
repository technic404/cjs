import {Container} from "./Container.mjs";

export const RootLayout = new CjsLayout(() =>
    [
        [Container]
    ]
);

RootLayout.onLoad(() => {
    console.log('RootLayout loaded!')
});