import { CjsLayout } from "cjs";
import { Container } from "./Container";

export const RootLayout = new CjsLayout((data) => [
    [Container.withData({ text: "Hello" })]
]);
