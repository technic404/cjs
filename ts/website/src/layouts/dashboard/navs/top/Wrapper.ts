import {CjsComponent} from "cjs";

export class Wrapper extends CjsComponent {
    _template() {

        return `
            <nav class="wrapper"></nav>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/navs/top/_styles/Wrapper.css';
};