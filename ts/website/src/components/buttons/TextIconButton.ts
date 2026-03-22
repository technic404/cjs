/** @typedef {{ icon?: string, text?: string, click?: function, fill?: boolean }} Data */


import {CjsAnyEventCallback, CjsComponent, onClick, strif} from "cjs";

/** @cjs {Data} */

type Data = {
    icon: string
    text: string,
    click: CjsAnyEventCallback,
    fill?: boolean
}
export class TextIconButton extends CjsComponent<Data> {
    _defaultData = {
        fill: false
    };

    _template() {
        const { icon, text, click, fill } = this.data;

        return `
            <button scale class="text-icon-button ${strif(fill!, 'fill')}" ${onClick(click)}>
                <img src="${icon}" alt="${text}">
                <p>${text}</p>
            </button>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/buttons/_styles/TextIconButton.css';
};