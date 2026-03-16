import { CjsComponent, CjsLayout, wrap } from "cjs";
import { Container } from "./Container";

export const RootLayout = new CjsLayout((data) => [
    [Container.withData({ text: "Hello" })],
    [Container]
]);
