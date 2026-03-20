import { ArchaeologicalSiteData } from "../../types";
import {CjsNotification, CjsRequest} from "cjs";
import {ApiUrl} from "../../constants"; // Assuming you exported your TS types

export class ArchaeologicalSitesDataRequests {
    #path = `${ApiUrl}/archaeological-sites-data`;

    async getBySite(siteId: number) {
        const request = await new CjsRequest<ArchaeologicalSiteData[]>(`${this.#path}/get-by-site`, "get")
            .setQuery({ siteId })
            .onError((err) => CjsNotification.error(err.json().error))
            .doRequest();

        return request.isError() ? null : (request.json() as ArchaeologicalSiteData[]);
    }

    async getByPublication(publicationId: number) {
        const request = await new CjsRequest<ArchaeologicalSiteData[]>(`${this.#path}/get-by-publication`, "get")
            .setQuery({ publicationId })
            .onError((err) => CjsNotification.error(err.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async create(data: { archaeologicalSiteId: number, analyzedPopulation: number, data: string[] }) {
        const request = await new CjsRequest<ArchaeologicalSiteData>(`${this.#path}/create`, "post")
            .setBody(data)
            .onError((err) => CjsNotification.error(err.json().error))
            .doRequest();

        return request.isError() ? null : request.json();
    }

    async remove(id: number) {
        const request = await new CjsRequest(`${this.#path}/remove`, "delete")
            .setBody({ id })
            .onError((err) => CjsNotification.error(err.json().error))
            .doRequest();

        return !request.isError();
    }
}