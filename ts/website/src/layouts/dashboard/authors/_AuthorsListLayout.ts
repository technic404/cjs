import {CjsLayout, CjsSearch, svg} from "cjs";
import {ContentHeader} from "../../../components/dashboard/ContentHeader";
import {TextIconButton} from "../../../components/buttons/TextIconButton";
import {ContentWrapper} from "../../../components/dashboard/ContentWrapper";
import {SearchCard} from "../../../components/dashboard/SearchCard";
import {App} from "../../../requests/App";
import {IconButton} from "../../../components/buttons/IconButton";
import {Author} from "../../../types";

export const AuthorsListLayout = new CjsLayout(() =>
    [
        [ContentHeader.withData({ text: "Authors" }), [
            [TextIconButton.withData({
                text: "Create",
                icon: svg('plus'),
                click: () => CjsSearch.set("/authors/new"),
                fill: true
            })]
        ]],
        [ContentWrapper, [
            [SearchCard.withStyle({ width: "100%" }).withData({
                th: ["ID", "FIRSTNAME", "LASTNAME", ""],
                title: "Authors list",
                searchCallback: async (value, offset) => {
                    return (await App.authors.search({
                        text: value,
                        offset
                    }))!;
                },
                mapperCallback: (author: Author) => [
                    `#${author.id}`,
                    author.firstname,
                    author.lastname,
                    IconButton.render({
                        icon: svg('pen'),
                        click: () => CjsSearch.set(`/authors/${author.id}`)
                    })
                ]
            })]
        ]],
    ]
);