import {CjsComponent} from "cjs";

export class Nav extends CjsComponent {

    _template() {

        return `
            <nav></nav>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/filters/_styles/Nav.css';
};