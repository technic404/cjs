import {CjsComponent} from "cjs";
import {Logo} from "../../../../components/Logo";

export class LeftCorner extends CjsComponent {
    _template() {
        return `
            <div class="left-corner">
                ${Logo.render({ scale: 1.15 })}
            </div>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/navs/top/_styles/LeftCorner.css';
};