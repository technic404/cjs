import { CjsComponent, CjsNotification, onClick, onLoad,  } from "cjs";

type Data = {
    text: string;
}

export class Button extends CjsComponent<Data> {
    _defaultData = {
        text: "Simple button"
    };

    _template() {
        const { text } = this.data;
        const { test, load } = this.events;

        return `
            <button ${onClick(test)} ${onLoad(load)}>${text}</button>
    `;
    }

    _events() {
        const { text } = this.data;

        return {
            test: () => {
                CjsNotification.info(text)
            },
            load: () => console.log("Button with text loaded", text)
            
        };
    }

    _cssStyle = "layouts/root/_styles/Button.css";
}