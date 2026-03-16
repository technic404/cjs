import { mutationListener } from "../../listeners/Listeners";
import { CjsEventCallback } from "../../types";

/**
 * Executes when element is being loaded into website
 */
export function onLoad(f: CjsEventCallback): string {
    return mutationListener.listen("add", f) as string;
}