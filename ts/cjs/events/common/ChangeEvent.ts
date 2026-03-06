import { functionMappings } from "../../FunctionMappings";
import { CjsEvent } from "../../objects/CjsEvent";
import { AnyHTMLElement } from "../../types";

/**
 * Executes when the element changes
 */
export function onChange(f: (cjsEvent: CjsEvent) => any): string {
	return functionMappings.add("change", (e: Event, s: AnyHTMLElement) => {
		return f(new CjsEvent(e, s));
	});
}