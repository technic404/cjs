import {CjsComponent} from "cjs";

export class ContentWrapper extends CjsComponent {

    _template() {
        return `
            <div class="content-wrapper"></div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/dashboard/_styles/ContentWrapper.css';
};