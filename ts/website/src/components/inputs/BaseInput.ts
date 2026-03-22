import {CjsComponent, CjsEventsMap, onFocus, onFocusOut, onLoad} from "cjs";

type Data = {
    text: string,
    placeholder?: string,
    name: string,
    type?: "text"|"number"|"date"|"email"|"password"|"textarea",
    value?: any
}

/** @cjs {Data} */

export class BaseInput extends CjsComponent {
    _defaultData = {
        placeholder: "",
        type: "text",
        value: ""
    };

    #FOCUSED_CLASS_NAME = "focused";

    _template() {
        const { text, placeholder, name, type } = this.data;
        const { focus, focusOut, load } = this.events;

        const attributes = `
            name="${name}" 
            placeholder="${placeholder}"
            ${onLoad(load)}
            ${onFocus(focus)}
            ${onFocusOut(focusOut)}
        `;

        return `
            <label class="text-input">
                <p class="noselect">${text}</p>
                ${
                    type === "textarea"
                        ? `<textarea ${attributes}></textarea>`
                        : `<input type="${type}" ${attributes}>`
                }
            </label>
        `;
    }

    _events(): CjsEventsMap {
        const { value } = this.data;
        const el = this.element!;

        return {
            focus: (e) => el.classList.add(this.#FOCUSED_CLASS_NAME),
            focusOut: (e) => {
                if((e.source as HTMLInputElement).value.trim() === "") {
                    el.classList.remove(this.#FOCUSED_CLASS_NAME);
                }
            },
            load: (e) => {
                if(value !== "") (e.source as HTMLInputElement).value = value;

                if(`${value}`.length > 0) el.classList.add(this.#FOCUSED_CLASS_NAME);
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/components/inputs/_styles/BaseInput.css';
};