import {CjsComponent} from "cjs";

export class Column extends CjsComponent {
    _template() {
        return `
            <div class="column"></div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/alignments/_styles/Column.css';
};
