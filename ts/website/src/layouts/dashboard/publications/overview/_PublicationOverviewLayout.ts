import {Publication} from "../../../../types";
import {App} from "../../../../requests/App";
import {CjsLayout, CjsNotification, CjsSearch} from "cjs";
import {ContentHeader} from "../../../../components/dashboard/ContentHeader";
import {ContentWrapper} from "../../../../components/dashboard/ContentWrapper";
import {Card} from "../../../../components/dashboard/Card";
import {DataFormWrapper} from "../../../../components/dashboard/DataFormWrapper";
import {BaseInput} from "../../../../components/inputs/BaseInput";
import {Row} from "../../../../components/alignments/Row";
import {Column} from "../../../../components/alignments/Column";
import {SmallCheckboxGroupInput} from "../../../../components/inputs/SmallCheckboxGroupInput";
import {AuthorsSelectorLayout} from "./AuthorsSelectorLayout";
import {BoxCheckboxGroupInput} from "../../../../components/inputs/BoxCheckboxGroupInput";
import {Text} from "../../../../components/text/Text";
import {SitesListLayout} from "./SitesListLayout";
import {PublicationSitesDataListLayout} from "./PublicationSitesDataListLayout";
import {T} from "../../../../utils/TranslationsUtil";


async function createPublication(publication: Publication | null, data: any){
    data.publicationStatus = data.publicationStatus[0];
    data.publicationType = data.publicationType[0];

    if(!publication) {
        const added = await App.publications.create(data);

        if(added) {
            CjsSearch.set(`/publications/${added.id}`);
            CjsNotification.success("Successfully created publication");
        }
    } else {
        await App.publications.edit(CjsSearch.get<number>(1)!, data);

        CjsNotification.success("Successfully edited publication");
    }
}

export const PublicationOverviewLayout = new CjsLayout<Publication | null>((publication) =>
    [
        [ContentHeader.withData({ text: `Publication overview` })],
        [ContentWrapper, [
            [Card.withStyle({ width: "100%" }).withData({ title: "Publication data" }), [
                [DataFormWrapper.withData({
                    serializeOptions: { checkboxesReadType: "array" },
                    saveCallback: (data) => createPublication(publication, data)
                }), [
                    [BaseInput.withStyle({ width: "100%" }).withData({
                        text: "Title",
                        name: "title",
                        placeholder: "ex. ",
                        value: publication ? publication.title : "",
                    })],
                    [Row.withStyle({ gap: "8px" }), [
                        [BaseInput.withStyle({ width: "100%" }).withData({
                            text: "Year",
                            name: "year",
                            placeholder: "ex. 2017",
                            value: publication ? publication.year : "",
                            type: "number"
                        })],
                        [BaseInput.withStyle({ width: "100%" }).withData({
                            text: "Volume",
                            name: "volume",
                            placeholder: "ex. 4",
                            value: publication ? publication.volume : "",
                        })],
                    ]],
                    [Row.withStyle({ gap: "8px" }), [
                        [Column.withStyle({ width: "100%" }), [
                            [Text.withData({ content: T.p("publicationType"), size: 18 })],
                            [SmallCheckboxGroupInput.withData({
                                name: "publicationType",
                                mode: "single",
                                checked: publication ? publication.publicationType : "",
                                checkboxes: [
                                    {
                                        title: T.p("article"),
                                        value: "article"
                                    },
                                    {
                                        title: T.p("monograph"),
                                        value: "monograph"
                                    },
                                    {
                                        title: T.p("chapter"),
                                        value: "chapter"
                                    },
                                    {
                                        title: T.p("report"),
                                        value: "report"
                                    }
                                ]
                            })]
                        ]],
                        [Column.withStyle({ width: "100%" }), [
                            [Text.withData({ content: T.p("publicationStatus"), size: 18 })],
                            [BoxCheckboxGroupInput.withData({
                                name: "publicationStatus",
                                mode: "single",
                                checked: publication ? publication.publicationStatus : "",
                                checkboxes: [
                                    {
                                        title: T.p("published"),
                                        description: T.p("publishedDescription"),
                                        value: "published"
                                    },
                                    {
                                        title: T.p("preprint"),
                                        description: T.p("preprintDescription"),
                                        value: "preprint"
                                    }
                                ]
                            })]
                        ]]
                    ]],
                    [BaseInput.withStyle({ width: "100%" }).withData({
                        text: "Source address",
                        name: "sourceAddress",
                        placeholder: "ex. ",
                        value: publication ? publication.sourceAddress : "",
                    })],
                    [Row.withStyle({ gap: "8px" }), [
                        [BaseInput.withStyle({ width: "100%" }).withData({
                            text: "DOI",
                            name: "doi",
                            placeholder: "ex. ",
                            value: publication ? publication.doi : "",
                        })],
                        [BaseInput.withStyle({ width: "100%" }).withData({
                            text: "ISBN",
                            name: "isbn",
                            placeholder: "ex. ",
                            value: publication ? publication.isbn : "",
                        })],
                    ]],
                    [BaseInput.withStyle({ width: "100%" }).withData({
                        text: "Summary",
                        name: "summary",
                        type: "textarea",
                        placeholder: "ex. ",
                        value: publication ? publication.summary : "",
                    })],
                ]]
            ]],
            !publication ? null : [AuthorsSelectorLayout.withData(publication)],
            !publication ? null :
            [Column.withStyle({ gap: "15px" }), [
                [PublicationSitesDataListLayout.withData(publication)],
                [SitesListLayout.withData(publication)]
            ]]
        ]]
    ]
);