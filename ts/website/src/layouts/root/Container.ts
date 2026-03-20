import { CjsComponent,  } from "cjs";

type Data = {
}

export class Container extends CjsComponent<Data> {
    _defaultData = {
    };

    _template() {
        const {  } = this.data;
        const {  } = this.events;

        return `
            <div class="container"></div>
        `;
    }

    _events() {
        const {  } = this.data;

        return {
        }
    }

    _cssStyle = './src/layouts/root/_styles/Container.css';
}