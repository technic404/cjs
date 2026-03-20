import { CjsNotification, CjsRequest } from "cjs";
import { ApiUrl } from "../../constants";
import { Author } from "src/types";

export class AuthorsRequests {
    #path = `${ApiUrl}/authors`;

    async get(id: number) {
        const request = await new CjsRequest<Author>(`${this.#path}/get`, "get")
            .setQuery({ id })
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async search(query: { text?: string, limit?: number, offset?: number }) {
        const request = await new CjsRequest<Author[]>(`${this.#path}/search`, "get")
            .setQuery(query)
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async getAll(query: { ids?: number[] } = {}) {
        const request = await new CjsRequest<Author[]>(`${this.#path}/get-all`, "post")
            .setBody(query)
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async edit(id: number, data: { firstname?: string, lastname?: string }) {
        const request = await new CjsRequest<Author>(`${this.#path}/edit`, "patch")
            .setBody({ id, ...data })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async create(data: { firstname: string, lastname: string }) {
        const request = await new CjsRequest<Author>(`${this.#path}/create`, "post")
            .setBody({ ...data })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }
}