import { CjsPluginManager, init } from "cjs";
import { RootLayout } from "./layouts/root/_RootLayout";
import {ThemeUtil} from "./layouts/utils/ThemeUtil";

init(RootLayout);

CjsPluginManager.enable({
    notification: true
})

ThemeUtil.setTheme("light");

