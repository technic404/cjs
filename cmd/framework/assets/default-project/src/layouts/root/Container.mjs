/** @typedef {{  }} ContainerData */

export const Container = new class Container extends CjsComponent {
    /** @type {ContainerData} */
    data = { };

    _() {
        return `
            <div class="container"></div>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/root/_styles/Container.css';

    /** Typedefs */
    /** @param {ContainerData} data */ render(data);
    /** @param {ContainerData} data */ visualise(data);
}

Container.fillHeight();