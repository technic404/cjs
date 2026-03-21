import { CjsComponent, CjsEventsMap, onClick, onLoad } from "cjs";
import { T } from "src/layouts/utils/TranslationsUtil";
import { App } from "src/requests/App";
import { Publication } from "src/types";
import { Result } from "./Result";

export class Results extends CjsComponent {
    #EXTENDED_CLASS_NAME = "extended";

    _template() {
        const {  } = this.data;
        const { extend, loadPublications } = this.events;

        return `
            <section class="results">
                <header>
                    <p>${T.p("results")}</p>
                    <button ${onClick(extend)}>${T.p("extend")}</button>
                </header>
                <ul ${onLoad(loadPublications)}></ul>
            </section>
        `;
    }

    _events() {
        const element = this.element!;

        return {
            extend: () => {
                const button = element.querySelector("header > button")!;
                const isExtended = element.classList.contains(this.#EXTENDED_CLASS_NAME);

                element.classList[isExtended ? "remove" : "add"](this.#EXTENDED_CLASS_NAME);
                button.innerHTML = T.p(isExtended ? "extend" : "hide");
            },
            loadPublications: async () => {
                const publications = (await App.publications.search())!;

                this.loadPublications(publications);
            }
        } satisfies CjsEventsMap;
    }

    loadPublications(publications: Publication[]) {
        const ul = this.element!.querySelector("ul")!;
        ul.innerHTML = '';

        for(const publication of publications) {
            ul.appendChild(Result.visualise(publication));
        }
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/_styles/Results.css';
};