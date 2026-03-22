import {CjsComponent} from "cjs";

export class Wrapper extends CjsComponent {

    _template() {
        return `
            <div class="wrapper"></div>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/filters/_styles/Wrapper.css';
};