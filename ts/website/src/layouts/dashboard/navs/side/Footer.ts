import {CjsComponent} from "cjs";

export class Footer extends CjsComponent {
    _template() {
        return `
            <footer>
                Footer component works!
            </footer>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/navs/side/_styles/Footer.css';
};