import { CjsNotification, CjsRequest } from "cjs";
import { ApiUrl } from "../../constants";
import {ArchaeologicalSite} from "../../types";

export class ArchaeologicalSitesRequests {
    #path = `${ApiUrl}/archaeological-sites`;

    async get(id: number) {
        const request = await new CjsRequest<ArchaeologicalSite>(`${this.#path}/get`, "get")
            .setQuery({ id })
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async getAll(query: { publicationId?: number } = {}) {
        const request = await new CjsRequest<ArchaeologicalSite[]>(`${this.#path}/get-all`, "get")
            .setQuery({ ...query })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async search(query: { text?: string, limit?: number, offset?: number }) {
        const request = await new CjsRequest<ArchaeologicalSite[]>(`${this.#path}/search`, "get")
            .setQuery(query)
            // .setCacheHours(1)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async create(data: { name: string, country: string, lat: number, lng: number, yearDatingFrom: number, yearDatingTo: number }) {
        const request = await new CjsRequest<ArchaeologicalSite>(`${this.#path}/create`, "post")
            .setBody(data)
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async edit(id: number, data: { name?: string, country?: string, lat?: number, lng?: number, yearDatingFrom?: number, yearDatingTo?: number }) {
        const request = await new CjsRequest<ArchaeologicalSite>(`${this.#path}/edit`, "patch")
            .setBody({ id, ...data })
            .onError(_ => CjsNotification.error(_.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }
}