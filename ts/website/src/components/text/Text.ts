import {CjsComponent} from "cjs";

type Data = {
    content: string,
    size?: number
}

/** @cjs {Data} */

export class Text extends CjsComponent {
    _defaultData = {
        size: 16
    };

    _template() {
        const { content, size } = this.data;

        return `
            <p class="text" style="font-size: ${size}px;">
                ${content}
            </p>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/text/_styles/Text.css';
};