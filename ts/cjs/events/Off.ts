import { functionMappings } from "../FunctionMappings";
import { CjsEventTypes } from "../types";

/**
 * Disables all events in element, where this attribute is passed
 */
export function off(...event: CjsEventTypes[]) {
    return functionMappings.disable(event);
}

