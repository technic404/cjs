import {Logo} from "../../components/Logo.mjs";

export const Credits = new class Credits extends CjsComponent {
    data = {};
    _() {
        const {  } = this._renderData;

        return `
            <aside class="credits">
                 ${Logo.render()}
                <div class="separator">⨯</div>
                <img src="${png('uam-logo')}" alt="UAM Logo">
                <div class="separator">⨯</div>
                <img src="${png('ncn-logo')}" alt="NCN Logo">
            </aside>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/_styles/Credits.css';
};