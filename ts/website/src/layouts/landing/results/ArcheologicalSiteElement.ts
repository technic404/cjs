import { CjsComponent, strmap } from "cjs";
import { ArchaeologicalSite } from "../../../types";
import { CulturalGroups } from "../../../constants";
import { T } from "../../utils/TranslationsUtil";

type Data = {
    transformedData: any[],
    site: ArchaeologicalSite
}

export class ArcheologicalSiteElement extends CjsComponent<Data> {

    _template() {
        const { name, country, lat, lng, yearDatingFrom, yearDatingTo, culturalGroupId } = this.data.site;
        const { transformedData } = this.data;

        return `
            <tr class="archeological-site">
                <td>${name}</td>
                <td>${country}</td>
                <td>${T.p(CulturalGroups[culturalGroupId])}</td>
                ${strmap(transformedData, e => `<td>${e}</td>`)}
            </tr>
        `;
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/results/_styles/Results.css';
};