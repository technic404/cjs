import {Author, Publication} from "../../../../types";
import {App} from "../../../../requests/App";
import {CjsLayout, CjsNotification, svg} from "cjs";
import {IconButton} from "../../../../components/buttons/IconButton";
import {Card} from "../../../../components/dashboard/Card";
import {Row} from "../../../../components/alignments/Row";
import {CardTable} from "../../../../components/dashboard/CardTable";
import {SearchCard} from "../../../../components/dashboard/SearchCard";

function addAuthor(publication: Publication, author: Author) {
    App.publications
        .edit(publication.id, {
            authorIds: [author.id, ...publication.authorIds],
        })
        .then((editedPublication) => {
            if (!editedPublication) return;

            CjsNotification.success("Successfully added author");

            AuthorsSelectorLayout
                .withData(editedPublication)
                .reRender();
        });
};

async function loadTableCallback(publication: Publication) {
    return (await App.authors.getAll({ ids: publication.authorIds }))!.map(a => [
        `#${a.id}`,
        a.firstname,
        a.lastname,
        IconButton.render({
            icon: svg('trash'),
            danger: true,
            click: async () => {
                App.publications
                    .edit(publication.id, {
                        authorIds: publication.authorIds.filter(id => id !== a.id)
                    }).then(editedPublication => {
                    if(!editedPublication) return;

                    AuthorsSelectorLayout
                        .withData(editedPublication)
                        .reRender();

                    CjsNotification.success("Successfully removed author");
                });
            },
        })
    ]);
}

export const AuthorsSelectorLayout = new CjsLayout((publication: Publication | null) => [
        [Row.withStyle({ gap: "15px" }), [
            [Card.withStyle({ width: "100%" }).withData({ title: "Publication authors" }), [
                [CardTable.withData({
                    th: ["ID", "FIRSTNAME", "LASTNAME", ""],
                    onLoadTd: loadTableCallback.bind(null, publication!)
                })],
            ]],
            [SearchCard.withStyle({ width: "100%" }).withData({
                th: ["ID", "FIRSTNAME", "LASTNAME", ""],
                title: "Add author",
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
                        icon: svg('plus'),
                        click: addAuthor.bind(null, publication!, author)
                    })
                ]
            })]
        ]]
    ]
);