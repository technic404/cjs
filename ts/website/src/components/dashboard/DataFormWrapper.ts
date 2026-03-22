import {CjsComponent, CjsEventsMap, svg} from "cjs";
import {TextIconButton} from "../buttons/TextIconButton";

type Data = {
    saveCallback: (data: object) => Promise<void>,
    serializeOptions?: { checkboxesReadType?: ("array" | "single"), includeNoNames?: boolean }
}

export class DataFormWrapper extends CjsComponent<Data> {
    _defaultData = {
        saveCallback: async (data: object) => {},
        serializeOptions: {  }
    };

    _template() {
        const { click } = this.events;

        return `
            <div class="data-form-wrapper">
                <form>
                    <cjs:render></cjs:render>
                </form>
                ${TextIconButton.render({
                    icon: svg('checkmark-fill'),
                    text: "Save",
                    click,
                    fill: true
                })}
            </div>
        `;
    }

    _events()  {
        const { serializeOptions, saveCallback } = this.data;

        return {
            click: async ()  => {
                const data = this.getForms()![0].serialize(serializeOptions);

                await saveCallback(data);
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/components/dashboard/_styles/DataFormWrapper.css';
};
