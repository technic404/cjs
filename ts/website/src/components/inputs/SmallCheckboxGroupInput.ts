import {CjsComponent, CjsEventsMap, onClick, onLoad, strif, strmap} from "cjs";

type CheckboxData = {
    title: string
    name: string,
    value?: string,
    mode?: "multiple"|"single"
    checked?: boolean
};

export class Checkbox extends CjsComponent<CheckboxData> {
    _defaultData = {
        title: "Example",
        name: "example",
        value: "",
        mode: "multiple",
        checked: false
    } as const;

    _template() {
        const { title, name, value, mode, checked } = this.data;
        const { click, load } = this.events;


        return `
            <label class="small-checkbox-group-input" ${onClick(click)} ${onLoad(load)}>
                <p class="noselect">${title}</p>
                <input type="checkbox" name="${name}" value="${value}" ${strif(checked!, 'checked')}>
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
                if(mode === "single") {
                    const checkboxes = Array.from(e.source.parentElement!.children);

                    checkboxes.forEach(label => setChecked(false, label as HTMLElement));
                }

                const input = el.querySelector("input")!;
                const checked = input.checked;

                setChecked(!checked);
            },
            load: (e) => {
                if(checked) setChecked(true, e.source);
            }
        } satisfies CjsEventsMap;
    }

};

type Data = {
    name: string,
    mode?: "multiple"|"single",
    checked?: any|null,
    checkboxes: {title: string, value: any}[]
}

export class SmallCheckboxGroupInput extends CjsComponent<Data> {
    _defaultData = {
        name: "example",
        mode: "multiple",
        checked: null,
    } as const;

    _template() {
        const { checkboxes, name, mode, checked } = this.data;

        return `
            <div class="small-checkbox-group-input">
                ${strmap(checkboxes, checkbox => Checkbox.render({ 
                    ...checkbox, 
                    name, 
                    mode, 
                    checked: checked && checkbox.value === checked
                }))}
            </div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/inputs/_styles/SmallCheckboxGroupInput.css';
};