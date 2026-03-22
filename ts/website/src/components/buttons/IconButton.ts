import {CjsAnyEventCallback, CjsComponent, onClick, strif} from "cjs";

type Data = {
    icon: string,
    click: CjsAnyEventCallback,
    danger?: boolean
};

export class IconButton extends CjsComponent<Data> {
    _defaultData = {
        danger: false
    };

    _template() {
        const { icon, click, danger } = this.data;

        return `
            <button 
                ${onClick(click)}
                class="icon-button ${strif(danger!, 'danger')}"
                scale
           >
                <img src="${icon}" alt="Icon button">
            </button>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/buttons/_styles/IconButton.css';
};