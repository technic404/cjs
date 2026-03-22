import {CjsComponent, CjsEventsMap, onInput} from "cjs";

type Data = {
    min: number,
    max: number,
    value: number,
    name: string,
    input?: (value: number) => any
}

export class RangeInput extends CjsComponent<Data> {
    _defaultData = {
        min: 0,
        max: 100,
        value: 0,
        name: "example",
        input: () => {}
    };

    #getPercent(min: number, max: number, value: number) {
        return ((value - min) / (max - min)) * 100;
    }

    _template() {
        const { min, max, value, name } = this.data;
        const { input } = this.events;

        return `
            <label class="range-input">
                <input 
                    ${onInput(input)} 
                    name="${name}" 
                    type="range" 
                    min="${min}" 
                    max="${max}" 
                    value="${value}"
                    style="--value: ${this.#getPercent(0, max, value)}%"
                >
            </label>
        `;
    }

    _events() {
        const { max } = this.data;
        const { input } = this.data;

        return {
            input: (e) => {
                const range = e.source as HTMLInputElement & { value: number };
                const percent = this.#getPercent(0, max, range.value);

                range.style.setProperty("--value", `${percent}%`);

                input!(parseInt(range.value));
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/components/inputs/_styles/RangeInput.css';
};