/** @typedef {{  }} Data */

/** @type {CjsComponent<Data>} */
export const Container = new class CjsComponent {
    data = { };

    _() {
        return `
            <div class="container"></div>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/root/_styles/Container.css';
}

Container.fillHeight();