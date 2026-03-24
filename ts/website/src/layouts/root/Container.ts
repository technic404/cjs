import { CjsComponent,  } from "cjs";

export class Container extends CjsComponent {
    _template() {
        return `
            <div class="container"></div>
        `;
    }

    _cssStyle = './src/layouts/root/_styles/Container.css';
}

