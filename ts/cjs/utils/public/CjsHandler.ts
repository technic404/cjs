import { CjsEvent } from "../../objects/CjsEvent";

/**
 * Creates a typed handle function for CjsEvent
 *
 * Useful for autocomplete + better type inference
 */
export function createHandle<T extends CjsEvent>(
    func: (event: T) => void
): (event: T) => void {

    return func;
}