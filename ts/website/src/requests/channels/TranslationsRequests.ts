import {CjsNotification, CjsRequest} from "cjs";
import {LanguageTag} from "../../types";
import {ApiUrl} from "../../constants";

export class TranslationsRequests {
    #path = `${ApiUrl}/translations`;

    async get(lang: LanguageTag) {
        const request = await new CjsRequest<object>(`${this.#path}/get`, "get")
            .setQuery({ lang })
            .onError(_ => CjsNotification.error("Error fetching translations file"))
            .doRequest();

        return request.isError() ? null : request.json();
    }
}