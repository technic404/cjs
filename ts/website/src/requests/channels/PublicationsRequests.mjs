import {ApiUrl} from "../../Constants.mjs";

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

    /**
     * @param {{ title?: string, offset?: number, limit?: number, archaeologicalSiteIds?: number[], chronologyFrom?: number, chronologyTo?: number, publicationTypes?: PublicationType[], publicationStatuses?: PublicationStatus[], culturalGroupIds?: number[], collectedDataTypes?: string[], minNumberOfIndividuals?: number, maxNumberOfIndividuals?: number }} query
     * @returns {Promise<Publication[]>}
     */
    async search(query = {}) {
        const request = await new CjsRequest(`${this.#path}/search`, "post")
            .onError(_ => CjsNotification.error(_.json().error))
            .setBody(query)
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {number} id
     * @returns {Promise<null|Publication>}
     */
    async get(id) {
        const request = await new CjsRequest(`${this.#path}/get`, "get")
            .onError(_ => CjsNotification.error(_.json().error))
            .setQuery({ id })
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {number} id
     * @param {Publication} data
     * @returns {Promise<null|Publication>}
     */
    async edit(id, data) {
        const request = await new CjsRequest(`${this.#path}/edit`, "patch")
            .onError(_ => CjsNotification.error(_.json().error))
            .setBody({ id, ...data })
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {{ year: number, title: string, volume: number|string, summary: string, publicationType: PublicationType, publicationStatus: PublicationStatus, sourceAddress: string, doi: string, isbn: string }} data
     * @returns {Promise<null|Author>}
     */
    async create(data) {
        const request = await new CjsRequest(`${this.#path}/create`, "post")
            .setBody({ ...data })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }
}