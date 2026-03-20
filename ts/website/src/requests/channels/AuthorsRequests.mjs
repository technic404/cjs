import {ApiUrl} from "../../Constants.mjs";

export class AuthorsRequests {
    #path = `${ApiUrl}/authors`;

    /**
     * @param {number} id
     * @returns {Promise<null|Author>}
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
     * @param {{ text?: string, limit?: number, offset?: limit }} query
     * @returns {Promise<Author[]>}
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
     * @param {{ ids?: number[] }} query
     * @returns {Promise<Author[]>}
     */
    async getAll(query = {}) {
        const request = await new CjsRequest(`${this.#path}/get-all`, "post")
            .setBody(query)
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {number} id
     * @param {{ firstname?: string, lastname?: string }} data
     * @returns {Promise<null|Author>}
     */
    async edit(id, data) {
        const request = await new CjsRequest(`${this.#path}/edit`, "patch")
            .setBody({ id, ...data })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    /**
     * @param {{ firstname: string, lastname: string }} data
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