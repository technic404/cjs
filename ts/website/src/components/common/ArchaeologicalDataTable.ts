import {ArchaeologicalSiteData} from "../../types";
import {CjsComponent, CjsEventsMap, onLoad, strmap} from "cjs";
import {T} from "../../utils/TranslationsUtil";

type Data = {
    prefixTh?: any[],
    suffixTh?: any[],
    loadCallback: () => Promise<{ prefixTd: any[], suffixTd: any[], data: ArchaeologicalSiteData }[]>
}

export class ArchaeologicalDataTable extends CjsComponent<Data> {
    _defaultData = {
        prefixTh: [],
        suffixTh: [],
    };

    _template() {
        const { prefixTh, suffixTh } = this.data;
        const { loadTable } = this.events;

        return `
            <table ${onLoad(loadTable)}>
                <tr>
                    ${strmap(prefixTh!, e => `<th>${e}</th>`)}
                    <th>${T.p("noIndividuals")}</th>
                    ${strmap(suffixTh!, e => `<th>${e}</th>`)}
                </tr>
            </table>
        `;
    }

    _events() {
        const { loadCallback } = this.data;

        return {
            loadTable: async (e) => {
                const sitesData = await loadCallback();
                const dataTypes = [
                    ...new Set(sitesData.map(e => e.data.data).flat(1))
                ].sort((a, b) => a.localeCompare(b));

                for(const dataType of dataTypes) {
                    e.source.querySelector("tr")!
                        .insertAdjacentHTML(`beforeend`, `
                            <th>${T.p(dataType)}</th>
                        `)
                }

                for(const siteData of sitesData) {
                    siteData.data.data = (() => {
                        const arr: string[] = [];

                        dataTypes.forEach(type => {
                            arr.push(siteData.data.data.includes(type) ? T.p("yes") : "-");
                        });

                        return arr;
                    })();

                    e.source.querySelector("tbody")!.innerHTML += `
                        <tr>
                            ${strmap(siteData.prefixTd, e => `<td>${e}</td>`)}
                            ${strmap([siteData.data.analyzedPopulation, ...siteData.data.data], e => `<td>${e}</td>`)}
                            ${strmap(siteData.suffixTd, e => `<td>${e}</td>`)}
                        </tr>
                    `;
                }
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/components/common/_styles/ArchaeologicalDataTable.css';
};