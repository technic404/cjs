import { CjsComponent } from "cjs";

type Data = {
    text: string;
}

export const Container: CjsComponent<Data> = new class Container extends CjsComponent<Data> {

    _() {
        const { text } = this._renderData;

        return `<p>${text}</p>`;
    }
}