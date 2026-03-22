import {CjsComponent} from "cjs";

export class Row extends CjsComponent {

    _template() {
        return `
            <div class="row"></div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/alignments/_styles/Row.css';
};
