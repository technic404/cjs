import {CjsComponent} from "cjs";

export class Content extends CjsComponent {
    _template() {
        return `
            <div class="content"></div>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/navs/top/_styles/Content.css';
};