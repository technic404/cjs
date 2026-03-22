import {CjsComponent} from "cjs";

type Data = {
    scale: number
};

export class Logo extends CjsComponent {
    _defaultData = { scale: 1 };

    _template() {
        const { scale } = this.data;

        return `
            <div class="logo" style="transform: scale(${scale});">
                <p>Normad<span class="sub">Arch</span></p>
            </div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/_styles/Logo.css';
};
