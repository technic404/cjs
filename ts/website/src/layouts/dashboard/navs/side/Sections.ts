import {CjsComponent} from "cjs";

export class Sections extends CjsComponent {
    _template() {
        return `
            <section class="sections"></section>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/dashboard/navs/side/_styles/Sections.css';
};