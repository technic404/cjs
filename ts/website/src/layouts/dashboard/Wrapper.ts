import {CjsComponent} from "cjs";

export class Wrapper extends CjsComponent {

    _template() {
        return `
            <section class="wrapper"></section>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/_styles/Wrapper.css';
};

Wrapper.fillHeight();