import { CjsErrorPrefix, CjsInfoPrefix, CjsSuccessPrefix } from "cjs/constants";

export const _CjsLoggerUtil = {
    info(text: string) {
        console.log(`${CjsInfoPrefix}${text}`);
    },
    success(text: string) {
        console.log(`${CjsSuccessPrefix}${text}`);
    },
    error(text: string) {
        console.log(`${CjsErrorPrefix}${text}`);
        
    }
}