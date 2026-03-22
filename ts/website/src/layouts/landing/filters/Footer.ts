import {CjsComponent, CjsEventsMap, CjsObjectUtil, onClick} from "cjs";
import {T} from "../../utils/TranslationsUtil";
import {App} from "../../../requests/App";
import {Filters} from "./Filters";
import {LandingFiltersInputs} from "./_LandingFiltersLayout";

export class Footer extends CjsComponent {
    _template() {
        const { clear, showResults } = this.events;

        return `
            <footer>
                <button ${onClick(clear)}>${T.p("clearAll")}</button>
                <button ${onClick(showResults)} class="fill">${T.p("showResults")}</button>
            </footer>
        `;
    }

    _events() {
        return {
            clear: (e) => LandingFiltersInputs.reRender(),
            showResults: async (e) => {
                const filters = Filters.getForms()![0].serialize({ checkboxesReadType: "array" });
                const nonNullFilters = CjsObjectUtil.filterOutNullableValues(filters);
                const publications = await App.publications.search(nonNullFilters);

                // Results.loadPublications(publications);
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/filters/_styles/Footer.css';
};