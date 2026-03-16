import { CJS_PRETTY_PREFIX_X } from "../Constants";

type FormElement =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

type ValueProcessor = (element: FormElement) => unknown;

/**
 * Object intended to manage the form data
 */
export class CjsForm {

    #element: HTMLFormElement;

    constructor(element: HTMLFormElement) {
        this.#element = element;
    }

    #valueProcessRules: Record<string, ValueProcessor> = {
        radio: (element) => (element as HTMLInputElement).checked ? element.value : null,
        checkbox: (element) => (element as HTMLInputElement).checked,
        file: (element) => (element as HTMLInputElement).files,
        number: (element) => element.value !== "" ? Number(element.value) : null,
        "*": (element) => element.value
    };

    serialize(options: CjsFormSerializeOptions = {}): Record<string | number, any> {
        const selects = Array.from(this.#element.querySelectorAll<HTMLSelectElement>("select"));
        const inputs = Array.from(this.#element.querySelectorAll<HTMLInputElement>("input"));
        const textareas = Array.from(this.#element.querySelectorAll<HTMLTextAreaElement>("textarea"));
        const elements = [...selects, ...inputs, ...textareas];
        const data: Record<string | number, any> = {};

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const name = element.getAttribute("name");

            if (!name && !options.includeNoNames) continue;

            const type = element.getAttribute("type") ?? "*";
            const rule = this.#valueProcessRules[type] ?? this.#valueProcessRules["*"];
            const value = rule(element as HTMLInputElement);
            const key = name ?? i;

            data[key] = value;
        }

        if (options.checkboxesReadType === "array") {
            const checkboxes = inputs.filter(e => e.type === "checkbox");

            for (const checkbox of checkboxes) {

                if (!checkbox.name) {
                    console.log(`${CJS_PRETTY_PREFIX_X}Checkbox doesn't have a name attribute, but it's required when options.checkboxesReadType === array`, checkbox);
                    continue;
                }

                const name = checkbox.name;

                if (!(name in data) || !Array.isArray(data[name])) {
                    data[name] = [];
                }

                if (!checkbox.checked) continue;

                data[name].push(checkbox.value);
            }
        }

        return data;
    }

}

export interface CjsFormSerializeOptions {
    checkboxesReadType?: "array" | "single";
    includeNoNames?: boolean;
}