import {ArchaeologicalSiteData, Publication} from "../../../../types";
import {App} from "../../../../requests/App";
import {PublicationSitesDataListLayout} from "./PublicationSitesDataListLayout";
import {CjsLayout, CjsNotification, svg} from "cjs";
import {IconButton} from "../../../../components/buttons/IconButton";
import {Card} from "../../../../components/dashboard/Card";
import {Text} from "../../../../components/text/Text";
import {ArchaeologicalDataTable} from "../../../../components/common/ArchaeologicalDataTable";

function addPublicationSiteData(publication: Publication, siteData: ArchaeologicalSiteData) {
    App.publications
        .edit(publication.id, {
            archaeologicalSiteDataIds: [
                siteData.id,
                ...publication.archaeologicalSiteDataIds,
            ],
        })
        .then((editedPublication) => {
            if (!editedPublication) return;

            PublicationSitesDataListLayout
                .withData(editedPublication)
                .reRender();

            SiteDataEntriesListLayout
                .withData({
                    siteId: siteData.archaeologicalSiteId,
                    publication: editedPublication,
                })
                .reRender();

            CjsNotification.success(
                "Successfully added site data to publication"
            );
        });
}

async function tableLoadCallback(publication: Publication, siteId: number) {
    return (await App.archaeologicalSitesData.getBySite(siteId))!
        .filter(siteData => !publication.archaeologicalSiteDataIds.includes(siteData.id))
        .map(siteData => {
            return {
                data: siteData,
                prefixTd: [
                    IconButton.render({
                        icon: svg('plus'),
                        click: addPublicationSiteData.bind(null, publication, siteData)
                    })
                ],
                suffixTd: []
            };
        })
}

export const SiteDataEntriesListLayout = new CjsLayout((data: { siteId: number | null, publication: Publication } | null) => [
        [Card.withStyle({ width: "100%" }).withData({ title: "Site >> site data" }), [
            !data!.siteId
                ? [Text
                    .withStyle({ color: "var(--dark-500)", textAlign: "center" })
                    .withData({ content: "No site selected, select site from right panel to display available site data" })
                ]
                : [ArchaeologicalDataTable
                    .withStyle({ overflow: "auto" })
                    .withData({ prefixTh: [""], loadCallback: tableLoadCallback.bind(null, data!.publication, data!.siteId) })
                ]
        ]]
    ]
)