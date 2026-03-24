import {CjsComponent} from "cjs";

export class ContentSection extends CjsComponent {
    _template() {
        return `
            <div class="content-section"></div>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/navs/top/_styles/ContentSection.css';
};