import { CjsNotification, CjsRequest } from "cjs";
import { ApiUrl } from "../../constants";
import { Author, Publication, PublicationStatus, PublicationType } from "../../types";

export class PublicationsRequests {
    #path = `${ApiUrl}/publications`;

    // /**
    //  * @param {{ chronologyFrom?: number, chronologyTo?: number, publicationTypes?: PublicationType[], publicationStatuses?: PublicationStatus[], culturalGroupIds?: number[], collectedDataTypes?: string[], minNumberOfIndividuals?: number, maxNumberOfIndividuals?: number }} query
    //  * @returns {Promise<Publication[]>}
    //  */
    // async getAll(query = {}) {
    //     const request = await new CjsRequest(`${this.#path}/get-all`, "get")
    //         .onError(_ => CjsNotification.error(_.json().error))
    //         .setQuery(query)
    //         .doRequest();
    //
    //     return request.isError() ? null : request.json();
    // }

    async search(query: { title?: string, offset?: number, limit?: number, archaeologicalSiteIds?: number[], chronologyFrom?: number, chronologyTo?: number, publicationTypes?: PublicationType[], publicationStatuses?: PublicationStatus[], culturalGroupIds?: number[], collectedDataTypes?: string[], minNumberOfIndividuals?: number, maxNumberOfIndividuals?: number } = { }) {
        const request = await new CjsRequest<Publication[]>(`${this.#path}/search`, "post")
            .onError(_ => CjsNotification.error(_.json().error))
            .setBody(query)
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async get(id: number) {
        const request = await new CjsRequest<Publication>(`${this.#path}/get`, "get")
            .onError(_ => CjsNotification.error(_.json().error))
            .setQuery({ id })
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async edit(id: number, data: Partial<Publication>) {
        const request = await new CjsRequest<Publication>(`${this.#path}/edit`, "patch")
            .onError(_ => CjsNotification.error(_.json().error))
            .setBody({ id, ...data })
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async create(data: Omit<Publication, "id">) {
        const request = await new CjsRequest<Publication>(`${this.#path}/create`, "post")
            .setBody({ ...data })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }
}