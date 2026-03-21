import { CjsComponent, onClick, strmap, svg } from "cjs";
import { Languages } from "../../constants";
import { LanguageTag, Translations } from "../utils/TranslationsUtil";

type Data = {
    lang: LanguageTag,
    fullLangName: string
}

class LanguageButton extends CjsComponent<Data> {
    _defaultData = {}; 

    _template() {
        const { fullLangName } = this.data;
        const { click } = this.events;

        return `<button ${onClick(click)}>${fullLangName}</button>`;
    }

    _events() {
        const { lang, fullLangName } = this.data;
        const element = this.element!;
        
        return this._wrapEvents({
            click: () => {
                Translations.set(lang);
                element.querySelector("header > button")!.innerHTML = fullLangName;
            }
        });
    }
}

export class LanguageSelector extends CjsComponent {
    _defaultData = {};

    _template() {
        const {  } = this.data;
        const { extend } = this.events;

        return `
            <section class="language-selector">
                <header>
                    <button ${onClick(extend)}>${Languages[Translations.lang]}</button>
                    <img src="${svg('down')}" alt="arrow">
                </header>
                <footer>
                    ${strmap(Object.entries(Languages), obj => {
                        const lang = obj[0] as LanguageTag;
                        const fullLangName = obj[1];

                        return LanguageButton.render({
                            lang, fullLangName
                        });
                    })}  
                </footer>
            </section>
        `;
    }

    _events() {
        const element = this.element!;

        return this._wrapEvents({
            extend: () => element.classList.toggle("extended"),
        });
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/_styles/LanguageSelector.css';
};