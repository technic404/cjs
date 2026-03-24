import {CjsLayout, svg} from "cjs";
import {ArchaeologicalSite, Publication} from "../../../../types";
import {SiteDataEntriesListLayout} from "./SiteDataEntriesListLayout";
import {Row} from "../../../../components/alignments/Row";
import {SearchCard} from "../../../../components/dashboard/SearchCard";
import {App} from "../../../../requests/App";
import {IconButton} from "../../../../components/buttons/IconButton";

function loadSiteDataEntries(publication: Publication, site: ArchaeologicalSite) {
    SiteDataEntriesListLayout
        .withData({ siteId: site.id, publication })
        .reRender();
}

export const SitesListLayout = new CjsLayout((publication: Publication | null) => [
        [Row.withStyle({ width: "100%", gap: "8px" }), [
            [SiteDataEntriesListLayout
                .withData({ siteId: null, publication: publication! })
                .withStyle({ width: "50%" })
            ],
            [SearchCard.withStyle({ width: "100%" }).withData({
                th: ["", "ID", "NAME", "COUNTRY"],
                title: "Sites",
                searchCallback: async (value, offset) => {
                    return (await App.archaeologicalSites.search({
                        text: value,
                        offset
                    }))!;
                },
                mapperCallback: (site: ArchaeologicalSite) => [
                    IconButton.render({
                        icon: svg('left'),
                        click: loadSiteDataEntries.bind(null, publication!, site)
                    }),
                    `#${site.id}`,
                    site.name,
                    site.country,
                ]
            })]
        ]]
    ]
)
