import {Languages} from "../../Constants.mjs";
import {T, Translations} from "../../utils/TranslationsUtil.mjs";

export const LanguageSelector = new class LanguageSelector extends CjsComponent {
    data = {};
    _(f) {
        const {  } = this._renderData;

        const extend = createHandle(_ => {
            f().classList.toggle("extended");
        });

        return `
            <section class="language-selector">
                <header>
                    <button ${onClick(extend)}>${Languages[Translations.lang]}</button>
                    <img src="${svg('down')}" alt="arrow">
                </header>
                <footer>
                    ${strmap(Object.entries(Languages), obj => {
                        const lang = obj[0];
                        const fullLangName = obj[1];
                        
                        const click = createHandle(_ => {
                            Translations.set(lang);
                            f().querySelector("header > button").innerText = fullLangName;
                        });
            
                        return `<button ${onClick(click)}>${fullLangName}</button>`;
                    })}  
                </footer>
            </section>
        `;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/_styles/LanguageSelector.css';
};