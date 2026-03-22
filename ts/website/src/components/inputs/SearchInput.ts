import {CjsComponent, onClick, onInput, onOuterclick, svg} from "cjs";


type Data = {
    input?: (value: string) => void,
    outerClick?: () => void
}

export class SearchInput extends CjsComponent<Data> {
    _defaultData = {
        input: () => {},
        outerClick: () => {}
    };

    _template() {
        const { input, outerClick } = this.data;

        return `
            <div class="search-input">
                <img src="${svg(`search`)}" class="noselect" alt="Search">
                <input 
                    type="text" 
                    placeholder="Search here..." 
                    ${onClick((e) => input!((e.source as HTMLInputElement).value))} 
                    ${onOuterclick(outerClick!)} 
                    ${onInput((e) => input!((e.source as HTMLInputElement).value))}
                >
            </div>
        `;
    }

    /** Settings */
    _cssStyle = './src/components/inputs/_styles/SearchInput.css';
};