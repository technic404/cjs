import { CjsLayout, wrap } from "cjs";
import { Container } from "./Container";

export const RootLayout = new CjsLayout((data) => [
    [wrap(Container).withData({ text: "Hello" })],
    [Container]
]);
