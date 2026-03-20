import {ArchaeologicalSite} from "../../types";
import {CjsComponent} from "cjs";


type Data = {
    data: any[],
    site: ArchaeologicalSite
}

/** @cjs {Data} */
class ArcheologicalSiteElement extends CjsComponent<Data> {
    _defaultData = {
        site: {},
        transformedData: []
    };

    _() {
        const { name, country, lat, lng, yearDatingFrom, yearDatingTo, culturalGroupId } = this._renderData.site;
        const { transformedData } = this._renderData;

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
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/_styles/Results.css';
};

/** @cjs {Publication} */
const Result = new class Result extends CjsComponent {
    data = {};

    _() {
        const { id, title, year, authorIds, publicationType, publicationStatus, sourceAddress, doi, isbn } = this._renderData;

        const loadAuthors = createHandle(async e => {
            e.source.innerText += (await Promise.all(
                authorIds.map(async id => {
                    const author = await App.authors.get(id);

                    return `${author.firstname} ${author.lastname}`;
                })
            )).join(", ");
        });

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
                        const sitesData = await App.archeologicalSitesData.getByPublication(id);
                        
                        return await Promise.all(sitesData.map(async data => {
                            const site = await App.archeologicalSites.get(data.archaeologicalSiteId);
                            
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

    /** Settings */
    _renderData = this.data;
    _cssStyle = './src/layouts/landing/_styles/Results.css';
};

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