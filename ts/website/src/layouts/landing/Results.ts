import {ArchaeologicalSite} from "../../types";
import {CjsComponent} from "cjs";




export const Results = new class Results extends CjsComponent {
    #EXTENDED_CLASS_NAME = "extended";
    data = {};

    _() {
        const {  } = this._renderData;

        const extend = createHandle(e => {
            const component = e.component;
            const button = component.querySelector("header > button");
            const isExtended = component.classList.contains(this.#EXTENDED_CLASS_NAME);

            component.classList[isExtended ? "remove" : "add"](this.#EXTENDED_CLASS_NAME);
            button.innerHTML = T.p(isExtended ? "extend" : "hide");
        });

        const load = createHandle(async e => {
             const publications = await App.publications.search();

             this.loadPublications(publications);
        });

        return `
            <section class="results">
                <header>
                    <p>${T.p("results")}</p>
                    <button ${onClick(extend)}>${T.p("extend")}</button>
                </header>
                <ul ${onLoad(load)}></ul>
            </section>
        `;
    }

    loadPublications(publications) {
        const ul = this.toElement().querySelector("ul");
        ul.innerHTML = '';

        for(const publication of publications) {
            ul.appendChild(Result.visualise(publication));
        }
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/_styles/Results.css';
};