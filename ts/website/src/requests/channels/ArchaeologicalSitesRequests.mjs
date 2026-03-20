import {ApiUrl} from "../../Constants.mjs";

export class ArchaeologicalSitesRequests {
    #path = `${ApiUrl}/archaeological-sites`;

    /**
     * @param {number} id
     * @returns {Promise<null|ArchaeologicalSite>}
     */
    async get(id) {
        const request = await new CjsRequest(`${this.#path}/get`, "get")
            .setQuery({ id })
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {{ publicationId?: number }} query
     * @returns {Promise<null|ArchaeologicalSite[]>}
     */
    async getAll(query = {}) {
        const request = await new CjsRequest(`${this.#path}/get-all`, "get")
            .setQuery({ ...query })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {{ text?: string, limit?: number, offset?: limit }} query
     * @returns {Promise<ArchaeologicalSite[]>}
     */
    async search(query) {
        const request = await new CjsRequest(`${this.#path}/search`, "get")
            .setQuery(query)
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {{ name: string, country: string, lat: number, lng: number, yearDatingFrom: number, yearDatingTo: number }} data
     * @returns {Promise<ArchaeologicalSite>}
     */
    async create(data) {
        const request = await new CjsRequest(`${this.#path}/create`, "post")
            .setBody(data)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {number} id
     * @param {{ name?: string, country?: string, lat?: number, lng?: number, yearDatingFrom?: number, yearDatingTo?: number }} data
     * @returns {Promise<ArchaeologicalSite>}
     */
    async edit(id, data) {
        const request = await new CjsRequest(`${this.#path}/edit`, "patch")
            .setBody({ id, ...data })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }


}