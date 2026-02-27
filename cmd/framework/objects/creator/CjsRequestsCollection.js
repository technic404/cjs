const { cjsConfig } = require("../../../constants");
const CjsElement = require("./CjsElement");


class CjsRequestsCollection extends CjsElement {
    fileNameSuffix = "Requests.mjs";

    getContent() {
        const { pascalCase, kebabCase } = this.names;
        const content = [];
        const config = cjsConfig.getUser();
        const { channelsOnErrorCallback, channels } = config.creator;

        content.push(
            `import {ApiUrl} from "../../Constants.mjs";`,
            ``,
            `export class ${pascalCase} {`,
            this._tab(1) + "#path = `${ApiUrl}/" + kebabCase + "`;",
            ``,
            `${this._tab(1)}/**`,
            `${this._tab(1)} * @param {string} url`,
            `${this._tab(1)} * @param {string} method `,
            `${this._tab(1)} * @returns {CjsRequest}`,
            `${this._tab(1)} */`,
            `${this._tab(1)}#prepare(url, method) {`,
            `${this._tab(2)}return new CjsRequest(url, method)`,
            channelsOnErrorCallback.trim().length === 0 ? "" : `${this._tab(3)}.onError(${channelsOnErrorCallback.trim()})`,
            `${this._tab(1)}}`,
            ``
        );

        for(const [methodName, channel] of Object.entries(channels)) {
            const queryKeys = Object.keys(channel.query);
            const bodyKeys = Object.keys(channel.body);
            const noArguments = queryKeys.length === 0 && bodyKeys.length === 0;
            const functionArguments = queryKeys.concat(bodyKeys).join(", ");
            const jsDocContent = Object.entries(channel.query).concat(Object.entries(channel.body))
                .map(e => `${this._tab(1)} * @param {${e[1]}} ${e[0]}`)
                .join("\n");

            content.push(
                `${this._tab(1)}/**`,
                noArguments ? null : jsDocContent,
                `${this._tab(1)} * @returns {CustomObject}`,
                `${this._tab(1)} */`,
                `${this._tab(1)}async ${methodName}(${functionArguments}) {`,
                `${this._tab(2)}const request = ` + "this.#prepare(`${this.#path}" + channel.apiSuffix + "`, \"" + channel.method + "\")",
                queryKeys.length === 0 ? null : `${this._tab(3)}.setQuery({ ${queryKeys.join(", ")} })`,
                bodyKeys.length === 0 ? null : `${this._tab(3)}.setBody({ ${bodyKeys.join(", ")} })`,
                `${this._tab(3)}.doRequest();`,
                ``,
                `${this._tab(2)}return request.isError() ? null : request.json();`,
                `${this._tab(1)}}`,
                ``
            );
        }

        content.push(`}`);

        return content
            .filter(e => e !== null)
            .join("\n");
    }
}

module.exports = CjsRequestsCollection;