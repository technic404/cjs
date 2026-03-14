import { CjsComponent, onClick } from "cjs";

type Data = {
    text: string;
}

export class Container extends CjsComponent<Data> {
    _defaultData = {
        text: "Default text"
    };

    _template() {
        const { text } = this.data;
        const { test } = this.actions;

        return `
            <div>
                <p>${text}</p>
                <button ${onClick(test)}>Click me</button>
            </div>
        `;
    }

    _actions() {
        const { text } = this.data;

        return this.wrapActions({
            test: (e) => console.log("Container clicked", text, e)
        });
    }
}