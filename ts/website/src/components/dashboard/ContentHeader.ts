import {CjsComponent} from "cjs";

type Data = {
    text: string
}

export class ContentHeader extends CjsComponent<Data> {
    _template() {
        const { text } = this.data;

        return `
            <header class="content-header">
                <h2>${text}</h2>
                <div class="content">
                    <cjsrender></cjsrender>
                </div>
            </header>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/dashboard/_styles/ContentHeader.css';
};