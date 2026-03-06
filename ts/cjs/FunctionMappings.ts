import { CJS_ELEMENT_DISABLED_PREFIX, CJS_ELEMENT_PREFIX, CJS_ID_LENGTH, CJS_PRETTY_PREFIX_X } from "./Constants";
import { flattenInfinite } from "./utils/ArrayUtil";
import { Colors } from "./utils/ConsoleColorsUtil";
import { findParentThatHasAttribute, getAttributeStartingWith } from "./utils/ElementUtil";
import { getRandomCharacters } from "./utils/StringUtil";

type MappingFunction = (event: Event, element: HTMLElement, data: any) => void;

interface MappingOptions {
	windowApplied: boolean;
	additionalName: string | null;
}

interface MappingEntry {
	type: CjsCommonEvents;
	action: MappingFunction;
	options: MappingOptions;
	data: any;
	isApplied: boolean;
	isLocked: boolean;
}

interface DisabledEntry {
	events: CjsCustomEvents[];
}

interface AppliedFunctionEntry {
	element: HTMLElement | Window;
	type: string;
	mappingFunction: EventListener;
}

class FunctionMappings {
	private mappings = new Map<string, MappingEntry>();
	private disabled = new Map<string, DisabledEntry>();
	private appliedFunctions = new Map<string, AppliedFunctionEntry>();

	/**
	 * Adds new listener to website for provided event
	 */
	add(type: CjsCommonEvents, mappingFunction: MappingFunction, options: MappingOptions = { windowApplied: false, additionalName: null }, data: any = {}): string {
		let attribute: string | null = null;

		while (this.mappings.has(attribute as string) || attribute === null) {
			attribute = `${CJS_ELEMENT_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
		}

		this.mappings.set(attribute, {
			type,
			action: mappingFunction,
			options,
			data,
			isApplied: false,
			isLocked: false
		});

		return ` ${attribute} `;
	}

	/**
	 * Disables the provided event from being executed
	 */
	disable(event: CjsCustomEvents[]): string {
		let attribute: string | null = null;

		while (this.mappings.has(attribute as string) || attribute === null) {
			attribute = `${CJS_ELEMENT_DISABLED_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
		}

		this.disabled.set(attribute, { events: event });

		return ` ${attribute} `;
	}

	cloneMapping(sourceAttribute: string): string | null {
		if (!this.mappings.has(sourceAttribute)) {
			console.log(`${CJS_PRETTY_PREFIX_X}Cannot clone mapping for ${Colors.Yellow}"${sourceAttribute}"${Colors.None}, because it does not exists`);
			return null;
		}

		const mapping = this.mappings.get(sourceAttribute)!;

		return this.add(mapping.type, mapping.action, mapping.options, mapping.data);
	}

	getElementActionAttributes(element: HTMLElement, filterEventType: string | null = null, includeChildren = false): string[] {
		const attributes: string[] = [];
		const elements = [
			element,
			...(includeChildren ? Array.from(element.children) : [])
		];

		for (const child of elements) {
			const attributesStarting = getAttributeStartingWith(
				child as HTMLElement,
				CJS_ELEMENT_PREFIX
			);

			if (filterEventType !== null) {
				attributesStarting.forEach((attributeStarting: string) => {
					if (!this.mappings.has(attributeStarting)) return;

					const mapping = this.mappings.get(attributeStarting)!;
					const { additionalName } = mapping.options;

					const eventNameNotMatch = mapping.type !== filterEventType;
					const additionalNameNotMatch =
						additionalName === null || filterEventType !== additionalName;

					if (eventNameNotMatch && additionalNameNotMatch) return;

					attributes.push(attributeStarting);
				});
			} else {
				attributes.push(...attributesStarting);
			}
		}

		return flattenInfinite(attributes);
	}

	setEventAttributeLocked(attribute: string, isLocked: boolean): void {
		if (!this.mappings.has(attribute)) {
			console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}${attribute}${Colors.None}, because it doesn't exists`);
			return;
		}

		const mapping = this.mappings.get(attribute)!;
		mapping.isLocked = isLocked;
	}

	isEventAttributeLocked(attribute: string): boolean | undefined {
		if (!this.mappings.has(attribute)) {
			console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}"${attribute}"${Colors.None}, because it doesn't exists`);
			return;
		}

		return this.mappings.get(attribute)!.isLocked;
	}

	setData(attribute: string, data: any): void {
		if (!this.mappings.has(attribute)) {
			console.log(`${CJS_PRETTY_PREFIX_X}Cannot set data for ${Colors.Yellow}"${attribute}"${Colors.None}, because it doesn't exists`);
			return;
		}

		this.mappings.get(attribute)!.data = data;
	}

	applyElementAttributeMappingFunction(element: HTMLElement, attribute: string, allowDuplicates = false): void {
		if (!this.mappings.has(attribute)) return;

		const mapping = this.mappings.get(attribute)!;

		if (mapping.isApplied && !allowDuplicates) return;

		mapping.isApplied = true;

		if (!element) {
			console.log(`${CJS_PRETTY_PREFIX_X}Fatal error mapping for ${Colors.Yellow}"${attribute}"${Colors.None} failed, cannot find element matching that attribute`);
			return;
		}

		const targetElementEvent: HTMLElement | Window = mapping.options.windowApplied
			? window
			: element;

		const eventFunction: EventListener = (event: Event) => {
			const parent = findParentThatHasAttribute(
				mapping.options.windowApplied ? (event.target as HTMLElement) : element,
				CJS_ELEMENT_DISABLED_PREFIX,
				true
			);

			if (parent !== null) {
				const startingAttributes = getAttributeStartingWith(parent,
					CJS_ELEMENT_DISABLED_PREFIX
				);

				for (const startingAttribute of startingAttributes) {
					if (!this.disabled.has(startingAttribute)) continue;

					const data = this.disabled.get(startingAttribute)!;

					const hasDisabledCommonEvent = data.events.includes(mapping.type);
					const hasDisabledAdditionalEvent =
						mapping.options.additionalName !== null &&
						data.events.includes(mapping.options.additionalName);

					if (hasDisabledCommonEvent || hasDisabledAdditionalEvent) {
						return;
					}
				}
			}

			if (this.isEventAttributeLocked(attribute)) return;

			mapping.action(event, element, mapping.data);
		};

		if (this.appliedFunctions.has(attribute)) {
			const lastApplied = this.appliedFunctions.get(attribute)!;
			
			lastApplied.element.removeEventListener(
				lastApplied.type,
				lastApplied.mappingFunction
			);
		}

		this.appliedFunctions.set(attribute, {
			element: targetElementEvent,
			type: mapping.type,
			mappingFunction: eventFunction
		});

		targetElementEvent.addEventListener(mapping.type, eventFunction);
	}

	removeElementAppliedFunctions(attribute: string): boolean {
		if (!this.appliedFunctions.has(attribute)) return false;

		const { element, type, mappingFunction } =
		this.appliedFunctions.get(attribute)!;

		element.removeEventListener(type, mappingFunction);

		return true;
	}

	applyElementMappingFunction(element: HTMLElement, allowDuplicates = false): void {
		const attributes = getAttributeStartingWith(element, CJS_ELEMENT_PREFIX);

		for (const attribute of attributes) {
			this.applyElementAttributeMappingFunction(element, attribute, allowDuplicates);
		}
	}

	applyBodyMappings(): void {
		for (const element of document.body.querySelectorAll("*")) {
			this.applyElementMappingFunction(element as HTMLElement, false);
			}
		}
	}

export const functionMappings = new FunctionMappings();