import { functionMappings } from "../../FunctionMappings";
import { CjsEvent } from "../../objects/CjsEvent";
import { CjsEventCallback } from "../../types";

/**
 * Executes when clicked outside the element
 */
export function onOuterclick(f: CjsEventCallback) {
    return functionMappings.add("click", (event, source) => {
        if (!document.body.contains(source)) return;

        if (source !== event.target && !source.contains(event.target as Node | null)) {
            f(new CjsEvent(event, source));
        }
    }, { windowApplied: true, additionalName: 'outerclick' });
}

