import {CjsComponent, CjsEventsMap, onClick, onLoad, strmap} from "cjs";

type CheckboxData = {
    title: string
    description: string
    name: string
    value?: string
    checked?: boolean
    mode?: "multiple"|"single"
};

class Checkbox extends CjsComponent<CheckboxData> {
    _defaultData = {
        title: "Example",
        description: "Some small description about element",
        name: "example",
        value: "",
        checked: false,
        mode: "multiple"
    } as const;

    _template() {
        const { title, description, name, value, mode, checked } = this.data;
        const { load, click } = this.events;

        return `
            <label ${onLoad(load)} ${onClick(click)}>
                <p class="noselect">${title}</p>
                <p class="description noselect">${description}</p>
                <input type="checkbox" name="${name}" value="${value}">
            </label>
        `;
    }

    _events() {
        const { mode, checked } = this.data;
        const el = this.element!;

        const setChecked = (isChecked: boolean, forceElement: HTMLElement | null = null) => {
            const label = forceElement || el;
            const checkbox = label.querySelector("input")!;

            checkbox.checked = isChecked;

            label.classList[checkbox.checked ? "add" : "remove"]("checked");
        }

        return {
            click: (e) => {
                const input = el.querySelector("input")!;
                const checked = input.checked;

                if(mode === "single") {
                    const checkboxes = Array.from(e.source.parentElement!.children);

                    checkboxes.forEach(label => setChecked(false, label as HTMLElement));
                }

                setChecked(!checked);
            },
            load: (e) => {
                if(checked) setChecked(true);
            }
        } satisfies CjsEventsMap;
    }
};

type Data = {
    name: string,
    mode?: "multiple"|"single",
    checked?: any,
    checkboxes: { title: string, description: string, value: string }[]
}

export class BoxCheckboxGroupInput extends CjsComponent<Data> {
    _defaultData = {
        mode: "multiple",
        checked: "",
    } as const;

    _template() {
        const { checkboxes, name, checked, mode } = this.data;

        return `
            <div class="checkbox-group-input">
                ${strmap(checkboxes, checkbox => Checkbox.render({ 
                    ...checkbox, 
                    name, 
                    checked: checked === checkbox.value, 
                    mode 
                }))}
            </div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/inputs/_styles/BoxCheckboxGroupInput.css';
};