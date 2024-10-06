class CjsRequestResult {
    /**
     *
     * @param {number} statusCode
     * @param {string} responseText
     * @param {boolean} networkError
     */
    constructor(statusCode, responseText, networkError) {
        this.statusCode = statusCode;
        this.responseText = responseText;
        this.networkError = networkError;
    }

    getStatusCode() {
        return this.statusCode;
    }

    isError() {
        return this.statusCode !== 200 || this.networkError;
    }

    isNetworkError() {
        return this.networkError;
    }

    text() {
        return this.responseText;
    }

    json() {
        return JSON.parse(this.responseText);
    }

    /**
     *
     * @param {number} code
     * @param {function} callback
     */
    onStatus(code, callback) {
        if(this.statusCode === code) {
            callback();
        }
    }
}

class CjsRequest {

    #onStartCallback = function() {};
    #onEndCallback = function() {};
    #onErrorCallback = function() {};
    #onSuccessCallback = function() {};
    #onProgressCallback = function() {};

    /**
     *
     * @param {string} url
     * @param {CjsRequestMethods} method
     */
    constructor(url, method) {
        this.url = url;
        this.method = method;
        this.query = {};
        this.body = {};
        this.headers = {};
        this.files = {};
        this.cooldown = 0;
    }

    /**
     *
     * @param {function} callback
     * @returns {CjsRequest}
     */
    onStart(callback) {
        this.#onStartCallback = callback;

        return this;
    }

    /**
     *
     * @param {function(CjsRequestResult)} callback
     * @returns {CjsRequest}
     */
    onEnd(callback) {
        this.#onEndCallback = callback;

        return this;
    }


    /**
     * Sets cooldown before making a request
     * @param {number} cooldown in milliseconds
     * @returns {CjsRequest}
     */
    setCooldown(cooldown) {
        this.cooldown = cooldown;

        return this;
    }

    /**
     * Sets function that will be called if occurred error
     * @param {function(CjsRequestResult)} callback 
     * @returns {CjsRequest}
     */
    onError(callback) {
        this.#onErrorCallback = callback;

        return this;
    }

    /**
     * Sets function that will be called if request was successfull
     * @param {function(CjsRequestResult)} callback 
     * @returns {CjsRequest}
     */
    onSuccess(callback) {
        this.#onSuccessCallback = callback;

        return this;
    }

    /**
     * @param {(percentage: number, loaded: number, total: number, event: ProgressEvent<EventTarget>) => void} callback 
     * @returns {CjsRequest}
     */
    onProgress(callback) {
        this.#onProgressCallback = callback;

        return this;
    }

    /**
     *
     * @return {Promise<CjsRequestResult>}
     */
    async doRequest() {
        if(this.cooldown > 0) {
            await new Promise((res) => setTimeout(() => res(), this.cooldown));
        }

        const xhr = new XMLHttpRequest();

        if(this.url === undefined) {
            console.log(`${CJS_PRETTY_PREFIX_X}Request url is undefined`);

            return new CjsRequestResult(0, null, true);
        }

        let url = this.url;

        if(this.method === undefined) {
            console.log(`${CJS_PRETTY_PREFIX_X}Request method is undefined (${this.url})`);

            return new CjsRequestResult(0, null, true);
        }

        if(this.method === "get") {
            url += `?${Object.keys(this.query).map(e => { return `${e}=${this.query[e]}` }).join("&")}`
        }

        xhr.open(this.method, url, true);

        for(const [key, value] of Object.entries(this.headers)) {
            xhr.setRequestHeader(key, `${value}`);
        }

        const bodyExists = Object.keys(this.body).length > 0;
        const filesExists = Object.keys(this.files).length > 0;

        if(filesExists && bodyExists) {
            console.log(`${CJS_PRETTY_PREFIX_X}Cannot send files and body data at the same time`);

            return new CjsRequestResult(0, null, true)
        }

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;

                this.#onProgressCallback(percentage, e.loaded, e.total, e);
            }
        };

        if(bodyExists) {
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(this.body));
        } else if(filesExists) {
            //xhr.setRequestHeader("Content-Type", "multipart/form-data");

            const formData = new FormData();

            for(const [key, value] of Object.entries(this.files)) {
                formData.append(key, value)
            }

            xhr.send(formData);
        } else {
            xhr.send();
        }

        xhr.onerror = (e) => {
            const requestResult = new CjsRequestResult(0, null, true);

            this.#onErrorCallback(requestResult);

            return requestResult;
        }

        this.#onStartCallback();

        return await new Promise(((resolve, reject) => {
            xhr.onreadystatechange = async () => {
                const requestResult = new CjsRequestResult(
                    xhr.status,
                    xhr.responseText,
                    (xhr.status === 0)
                );

                this.#onEndCallback(requestResult);

                if(xhr.readyState !== 4) return;

                if(!requestResult.isError()) {
                    this.#onSuccessCallback(requestResult);
                }

                resolve(requestResult);
            }
        }))
    }

    /**
     *
     * @param {object} query
     * @return {CjsRequest}
     */
    setQuery(query) {
        this.query = query;

        return this;
    }

    /**
     *
     * @param {object} headers
     * @returns {CjsRequest}
     */
    setHeaders(headers) {
        this.headers = headers;

        return this;
    }

    /**
     *
     * @param {object} body
     * @returns {CjsRequest}
     */
    setBody(body) {
        this.body = body;

        return this;
    }

    /**
     *
     * @param {object} files
     * @returns {CjsRequest}
     */
    setFiles(files) {
        this.files = files;

        return this;
    }
}