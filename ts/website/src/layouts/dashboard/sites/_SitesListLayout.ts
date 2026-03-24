import {CjsLayout, CjsSearch, CjsStringUtil, svg} from "cjs";
import {ContentHeader} from "../../../components/dashboard/ContentHeader";
import {TextIconButton} from "../../../components/buttons/TextIconButton";
import {ContentWrapper} from "../../../components/dashboard/ContentWrapper";
import {SearchCard} from "../../../components/dashboard/SearchCard";
import {App} from "../../../requests/App";
import {CulturalGroups} from "../../../constants";
import {IconButton} from "../../../components/buttons/IconButton";
import {ArchaeologicalSite} from "../../../types";

export const SitesListLayout = new CjsLayout(() =>
    [
        [ContentHeader.withData({ text: "Archaeological sites" }), [
            [TextIconButton.withData({
                text: "Create",
                icon: svg('plus'),
                click: () => CjsSearch.set("/sites/new"),
                fill: true
            })]
        ]],
        [ContentWrapper, [
            [SearchCard.withStyle({ width: "100%" }).withData({
                th: ["ID", "NAME", "COUNTRY", "CULTURAL GROUP", "COORDINATES", ""],
                title: "Archaeological sites list",
                searchCallback: async (value, offset) => {
                    return (await App.archaeologicalSites.search({
                        text: value,
                        offset
                    }))!;
                },
                mapperCallback: (site: ArchaeologicalSite) => [
                    `#${site.id}`,
                    site.name,
                    site.country,
                    CjsStringUtil.capitalize(CulturalGroups[site.culturalGroupId]),
                    `${site.lat} ${site.lng}`,
                    IconButton.render({
                        icon: svg('pen'),
                        click: () => CjsSearch.set(`/sites/${site.id}`)
                    })
                ]
            })]
        ]]
    ]
);