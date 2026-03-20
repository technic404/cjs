import { CjsPluginManager, init } from "cjs";
import { RootLayout } from "./layouts/root/_RootLayout";

init(RootLayout);

CjsPluginManager.enable({
    notification: true
})