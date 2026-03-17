import { CjsComponent,  } from "cjs";

type Data = {
    text: string;
}

export class Container extends CjsComponent<Data> {
    _defaultData = {
        text: "Default text"
    };

    _template() {
        const { text } = this.data;
        const { test } = this.events;

        return `
            <article>
                <p>${text}</p>
                <main>
                    <fx:render></fx:render>
                </main>
            </article>
        `;
    }

    _events() {
        const { text } = this.data;

        return {
            test: () => console.log("abc")
        }
    }
}