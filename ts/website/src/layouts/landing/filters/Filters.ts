import {CjsComponent} from "cjs";

export class Filters extends CjsComponent {
    _template() {
        return `
            <form class="filters"></form>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/filters/_styles/Filters.css';
};