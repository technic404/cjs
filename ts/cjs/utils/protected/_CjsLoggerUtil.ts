import { CjsErrorPrefix, CjsInfoPrefix, CjsSuccessPrefix } from "../../constants";
import { _ConsoleColorsUtil } from "./_ConsoleColorsUtil";

export const _CjsLoggerUtil = {
    info(text: string, ...args: any) {
        console.info(_ConsoleColorsUtil.format(`${CjsInfoPrefix}${text}`), args);
    },
    success(text: string, ...args: any) {
        console.log(_ConsoleColorsUtil.format(`${CjsSuccessPrefix}${text}`), args);
    },
    error(text: string, ...args: any) {
        console.warn(_ConsoleColorsUtil.format(`${CjsErrorPrefix}${text}`), args);
    }
}