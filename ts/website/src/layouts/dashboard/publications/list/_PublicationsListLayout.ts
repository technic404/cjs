import {CjsLayout, CjsSearch, svg} from "cjs";
import {ContentHeader} from "../../../../components/dashboard/ContentHeader";
import {TextIconButton} from "../../../../components/buttons/TextIconButton";
import {SearchCard} from "../../../../components/dashboard/SearchCard";
import {ContentWrapper} from "../../../../components/dashboard/ContentWrapper";
import {App} from "../../../../requests/App";
import {IconButton} from "../../../../components/buttons/IconButton";
import {formatDate} from "../../../../utils/DateUtil";
import {Publication} from "../../../../types";

export const PublicationsListLayout = new CjsLayout(() =>
    [
        [ContentHeader.withData({ text: "Publications" }), [
            [TextIconButton.withData({
                text: "Create",
                icon: svg('plus'),
                click: () => CjsSearch.set("/publications/new"),
                fill: true
            })]
        ]],
        [ContentWrapper, [
            [SearchCard.withStyle({ width: "100%" }).withData({
                th: ["ID", "TITLE", "AUTHORS IDS", "CREATED DATE", ""],
                title: "Publications list",
                searchCallback: async (value, offset) => {
                    return (await App.publications.search({
                        title: value,
                        offset
                    }))!;
                },
                mapperCallback: (publication: Publication) => [
                    `#${publication.id}`,
                    `<p class="oneliner" style="max-width: 500px;">${publication.title}</p>`,
                    publication.authorIds.map(e => `#${e}`).join(", "),
                    formatDate("DD.MM.YYYY HH:mm", new Date(publication.createdAt)),
                    IconButton.render({
                        icon: svg('pen'),
                        click: () => CjsSearch.set(`/publications/${publication.id}`)
                    })
                ]
            })]
        ]]
    ]
);