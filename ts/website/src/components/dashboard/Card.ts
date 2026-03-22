import {CjsComponent} from "cjs";

type Data = {
    title: string
    header?: string
}

export class Card extends CjsComponent<Data> {

    _defaultData = {
        title: "Example",
        header: ""
    };

    _template() {
        const { title, header } = this.data;

        return `
            <section class="card">
                <header>
                    <p>${title}</p>
                    <div class="content">
                        ${header}
                    </div>
                </header>
                <main>
                    <cjs:render></cjs:render>
                </main>
            </section>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/dashboard/_styles/Card.css';
};