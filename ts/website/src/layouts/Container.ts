import { CjsComponent } from "cjs";

type Data = {
    text: string;
}

export class Container extends CjsComponent<Data> {
    _defaultData = {
        text: "Default text"
    };

    _template() {
        const { text } = this.data;
        const { click } = this.actions;

        return `
            <div>
                <p>${text}</p>
                <button ${click}>Click me</button>
            </div>
        `;
    }

    _actions() {
        const { text } = this.data;

        return this.wrapActions({
            click: (e) => console.log("Container clicked", text, e)
        });
    }
}