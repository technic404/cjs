import {CjsComponent, strmap} from "cjs";


type CheckboxData = {
    title: string
    name: string
    value?: string
}

export class Checkbox extends CjsComponent<CheckboxData> {
    _defaultData = {
        title: "Example",
        name: "example",
        value: ""
    };

    _template() {
        const { title, name, value } = this.data;

        return `
            <label>
                <input type="checkbox" name="${name}" value="${value}">
                <p class="noselect">${title}</p>
            </label>
        `;
    }
};


type Data = {
    name: string
    checkboxes: { title: string, value: string }[]

}
export class VerticalCheckboxGroupInput extends CjsComponent<Data> {
    _defaultData = {
        name: "example",
        checkboxes: []
    };

    _template() {
        const { checkboxes, name } = this.data;

        return `
            <div class="vertical-checkbox-group-input">
                ${strmap(checkboxes, checkbox => Checkbox.render({ ...checkbox, name }))}
            </div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/inputs/_styles/VerticalCheckboxGroupInput.css';
};