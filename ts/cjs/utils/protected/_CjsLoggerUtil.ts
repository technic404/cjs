import { CjsErrorPrefix, CjsInfoPrefix, CjsSuccessPrefix } from "../../constants";

export const _CjsLoggerUtil = {
    info(text: string, ...args: any) {
        console.log(`${CjsInfoPrefix}${text}`, args);
    },
    success(text: string, ...args: any) {
        console.log(`${CjsSuccessPrefix}${text}`, args);
    },
    error(text: string, ...args: any) {
        console.log(`${CjsErrorPrefix}${text}`, args);
        
    }
}