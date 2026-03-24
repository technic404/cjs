import {ArchaeologicalSite, ArchaeologicalSiteData, Publication} from "../../../../types";
import {App} from "../../../../requests/App";
import {CjsLayout, CjsNotification, svg} from "cjs";
import {IconButton} from "../../../../components/buttons/IconButton";
import {Card} from "../../../../components/dashboard/Card";
import {ArchaeologicalDataTable} from "../../../../components/common/ArchaeologicalDataTable";
import {SiteDataEntriesListLayout} from "./SiteDataEntriesListLayout";

function removePublicationSiteData(publication: Publication, siteData: ArchaeologicalSiteData){
    App.publications
        .edit(publication.id, {
            archaeologicalSiteDataIds: publication.archaeologicalSiteDataIds.filter(
                id => id !== siteData.id
            ),
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

            CjsNotification.success("Successfully removed publication site data");
        });
};

async function loadTableCallback(publication: Publication) {
    const sitesData = await App.archaeologicalSitesData.getByPublication(publication.id);

    return sitesData!.map(siteData => {
        return {
            data: siteData,
            prefixTd: [
                IconButton.render({
                    icon: svg('trash'),
                    danger: true,
                    click: removePublicationSiteData.bind(null, publication, siteData)
                }),
                `#${siteData.id}`,
            ],
            suffixTd: []
        };
    })
};

export const PublicationSitesDataListLayout = new CjsLayout((publication: Publication | null) => [
        [Card.withStyle({ width: "100%" }).withData({ title: "Publication sites data" }), [
            [ArchaeologicalDataTable.withStyle({ width: "100%" }).withData({
                prefixTh: ["", "ID"],
                loadCallback: loadTableCallback.bind(null, publication!)
            })]
        ]]
    ]
);