import {CjsComponent} from "cjs";

export class Content extends CjsComponent {
    _template() {
        return `
            <div class="content"></div>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/_styles/Content.css';
};