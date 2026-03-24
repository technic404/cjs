import {CjsComponent} from "cjs";
import {T} from "../../../utils/TranslationsUtil";

export class Header extends CjsComponent {
    _template() {

        return `
            <header>
                <p>${T.p("filters")}</p>
            </header>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/filters/_styles/Header.css';
};