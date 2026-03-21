import { CjsComponent, CjsEventsMap, onLoad, strmap, svg } from "cjs";
import { Publication } from "../../../types";
import { App } from "../../../requests/App";
import { T } from "../../utils/TranslationsUtil";
import { CulturalGroups } from "../../../constants";

export class Result extends CjsComponent<Publication> {
    _template() {
        const { id, title, year, authorIds, publicationType, publicationStatus, sourceAddress, doi, isbn } = this.data;
        const { loadAuthors } = this.events;

        return `
            <li class="result">
                <div class="header">
                    <div class="icon">
                        <img src="${svg(publicationType)}" alt="${publicationType}">
                    </div>
                    <div class="box">
                        <p class="oneliner">${title}</p>
                        <p class="sub">${year} | ${T.p(publicationStatus)}, ${T.p(publicationType)}</p>
                    </div>                    
                </div>
                <p>${T.p("analyzedArchaeologicalData")}</p>
                ${ArchaeologicalDataTable.render({
                    prefixTh: [T.p("name"), T.p("country"), T.p("culturalGroup")],
                    loadCallback: async () => {
                        const sitesData = (await App.archaeologicalSitesData.getByPublication(id))!;
                        
                        return await Promise.all(sitesData.map(async data => {
                            const site = (await App.archaeologicalSites.get(data.archaeologicalSiteId))!;
                            
                            return {
                                data,
                                prefixTd: [site.name, site.country, T.p(CulturalGroups[site.culturalGroupId])],
                                suffixTd: []
                            };
                        }));
                    }
                })}
                <p>${T.p("information")}</p>
                <ul>
                    ${strmap([
                        { key: "DOI", value: doi },
                        { key: "ISBN", value: isbn },
                    ].filter(e => e.value.trim() !== ""), e => `
                        <li>
                            <mark>${e.key}</mark>
                            <p class="oneliner">${e.value}</p>
                        </li>
                    `)}
                    
                    <li>
                        <a class="oneliner" href="${sourceAddress}" target="_blank">${sourceAddress}</a>
                    </li>
                    <li class="authors">
                        <p ${onLoad(loadAuthors)}>~&nbsp;</p>
                    </li>
                </ul>
            </li>
        `;
    }

    _events() {
        const { authorIds } = this.data;
        
        return {
            loadAuthors: async (e) => {
                e.source.innerText += (await Promise.all(
                    authorIds.map(async id => {
                        const author = (await App.authors.get(id))!;

                        return `${author.firstname} ${author.lastname}`;
                    })
                )).join(", ");
            }
        } satisfies CjsEventsMap;
    }

    /** Settings */
    _cssStyle = './src/layouts/landing/_styles/Results.css';
};