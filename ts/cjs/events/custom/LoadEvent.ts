import { CjsEventCallback, CjsNullEventCallback } from "../../types";
import { CjsEventsManager } from "../CjsEventsManager";

/**
 * Executes when element is being loaded into website
 */
export function onLoad(callback: CjsNullEventCallback): string {
    return CjsEventsManager.addOnAddElementCallback(callback);
}