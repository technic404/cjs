import { CjsComponent, onClick,  } from "cjs";

type Data = {
    text: string;
}

export class Button extends CjsComponent<Data> {
    _defaultData = {
        text: "Simple button"
    };

    _template() {
        const { text } = this.data;
        const { test } = this.events;

        return `
            <button ${onClick(test)}>${text}</button>
    `;
    }

    _events() {
        const { text } = this.data;

        return {
            test: () => console.log(text)
        };
    }

    _cssStyle = "layouts/root/_styles/Button.css";
}