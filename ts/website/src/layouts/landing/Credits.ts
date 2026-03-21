import { CjsComponent, CjsEventsMap, png } from "cjs";
import {Logo} from "../../components/Logo.mjs";

type Data = {
    
}

export class Credits extends CjsComponent<Data> {
    _defaultData = {};

    _template() {
        const { } = this.data;
        const { } = this.events;

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

    _events() {
        return {} satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/_styles/Credits.css';
};