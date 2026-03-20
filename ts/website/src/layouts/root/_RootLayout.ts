import { CjsComponent, CjsLayout } from "cjs";
import { Container } from "./Container";
import { Button } from "./Button";


export const RootLayout = new CjsLayout((data) => [
    [Container.withData({ text: "Hello" })],
    [Container.withData({ text: "ok?" })],
    [Container, [
        [Button.withData({ text: "Hello" })],
        [Button.withData({ text: "Hello 1" })],
        [Button.withData({ text: "Hello2" })],
        [Button.withData({ text: "Hello34" })],
    ]],
    [Container.withStyle({ border: "1px solid black", padding: "10px" })],
]);
