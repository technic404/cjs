import {CjsComponent, CjsEventsMap, onInput, onLoad} from "cjs";

type Data = {
    min: number,
    max: number,
    valueMin: number
    valueMax: number
    nameFrom: string
    nameTo: string
    onInputFrom: (value: number) => void
    onInputTo: (value: number) => void
}

export class TwoSideRangeInput extends CjsComponent<Data> {
    _defaultData = {
        min: -100,
        max: 100,
        valueMin: -100,
        valueMax: 100,
        nameFrom: "rangeFrom",
        nameTo: "rangeTo",
        onInputFrom: () => {},
        onInputTo: () => {},
    };

    #PRECISION = 0.5;

    _template() {
        // TODO Fix for center, to be dynamically assigned
        const { min, max, nameFrom, nameTo, valueMin, valueMax } = this.data;
        const { inputLeft, inputRight } = this.events;

        return `
            <div class="two-side-range-input">
                <div class="slider-track"></div>
                <input 
                    ${onInput(inputLeft)} 
                    ${onLoad(inputLeft)}
                    type="range" 
                    step="${this.#PRECISION}"
                    min="0" 
                    max="100" 
                    value="${valueMin}" 
                    style="">
                <input 
                    ${onInput(inputRight)} 
                    ${onLoad(inputRight)}
                    type="range" 
                    step="${this.#PRECISION}"
                    min="0" 
                    max="100" 
                    value="${valueMax}" 
                    style="">
                <input type="number" name="${nameFrom}">
                <input type="number" name="${nameTo}">
            </div>
        `;
    }

    _events() {
        const { min, max, onInputTo, onInputFrom } = this.data;
        const el = this.element!;

        const MIN_GAP = 10;

        function fillColor() {
            const rangeInputs = el.querySelectorAll<HTMLInputElement & { value: number }>("input[type=range]");
            const percent1 = (rangeInputs[0].value / max) * 100;
            const percent2 = (rangeInputs[1].value / max) * 100;

            el.querySelector<HTMLDivElement>(".slider-track")!
                .style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
        }

        const length = Math.abs(min) + Math.abs(max);
        const diff = min < 0 !== max < 0 ? length : max - min;
        const getVal = (percentage: number) => {
            const unitProgress = diff * (percentage / 100);

            if(min <= 0 && unitProgress < Math.abs(min)) return (min + unitProgress);

            return min + unitProgress;
        }

        return {
            inputLeft: (e) => {
                const slider = e.source as HTMLInputElement;
                const rightSlider = el.querySelectorAll("input[type=range]")[1] as HTMLInputElement;

                if (rightSlider.valueAsNumber - slider.valueAsNumber <= MIN_GAP) {
                    slider.valueAsNumber = rightSlider.valueAsNumber - MIN_GAP;
                }

                fillColor();
                onInputFrom(parseFloat(getVal(slider.valueAsNumber).toFixed(2)));
            },
            inputRight: e => {
                const slider = e.source as HTMLInputElement;
                const leftSlider = el.querySelectorAll("input[type=range]")[0] as HTMLInputElement;

                if (slider.valueAsNumber - leftSlider.valueAsNumber <= MIN_GAP) {
                    slider.valueAsNumber = leftSlider.valueAsNumber + MIN_GAP;
                }

                fillColor();
                onInputTo(parseFloat(getVal(slider.valueAsNumber).toFixed(2)));
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/components/inputs/_styles/TwoSideRangeInput.css';
};