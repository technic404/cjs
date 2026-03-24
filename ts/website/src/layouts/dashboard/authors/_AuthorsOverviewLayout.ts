import {CjsLayout, CjsNotification, CjsSearch} from "cjs";
import {Author} from "../../../types";
import {App} from "../../../requests/App";
import {ContentHeader} from "../../../components/dashboard/ContentHeader";
import {ContentWrapper} from "../../../components/dashboard/ContentWrapper";
import {Card} from "../../../components/dashboard/Card";
import {DataFormWrapper} from "../../../components/dashboard/DataFormWrapper";
import {Row} from "../../../components/alignments/Row";
import {BaseInput} from "../../../components/inputs/BaseInput";

async function createOrAddAuthor(
    author: Author | null,
    data: { firstname: string, lastname: string }
){
    if(!author) {
        const result = await App.authors.create(data);
        if(result) {
            CjsSearch.set(`/authors/${result.id}`);
            CjsNotification.success("Successfully created author");
        }
        return;
    }

    if(await App.authors.edit(CjsSearch.get<number>(1)!, data)) {
        CjsNotification.success("Successfully edited author");
    }
}

export const AuthorOverviewLayout = new CjsLayout<Author | null>((author) =>
    [
        [ContentHeader.withData({text: `Author ${author ? "overview" : "creation"}`})],
        [ContentWrapper, [
            [Card.withStyle({width: "100%"}).withData({title: "Author data"}), [
                [DataFormWrapper.withData({
                    saveCallback: (data) => createOrAddAuthor(author, data)
                }), [
                    [Row.withStyle({gap: "8px"}), [
                        [BaseInput.withStyle({width: "100%"}).withData({
                            text: "Firstname",
                            name: "firstname",
                            placeholder: "ex. John",
                            value: author ? author.firstname : "",
                        })],
                        [BaseInput.withStyle({width: "100%"}).withData({
                            text: "Lastname",
                            name: "lastname",
                            placeholder: "ex. Doe",
                            value: author ? author.lastname : "",
                        })],
                    ]],
                ]]
            ]],
        ]]
    ]
);