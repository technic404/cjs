class CjsRequestResult {

    /**
     * @param {number} statusCode
     * @param {ArrayBuffer|Blob|Document|object|string} response
     * @param {boolean} networkError
     */
    constructor(statusCode, response, networkError) {
        this.statusCode = statusCode;
        this.response = response;
        this.networkError = networkError;
    }

    getStatusCode() {
        return this.statusCode;
    }

    isError() {
        return !(`${this.statusCode}`.startsWith("2")) || this.networkError;
    }

    /** @returns {boolean} */
    isNetworkError() { return this.networkError; }

    /** @returns {string} */
    text() { return this.response; }

    /** @returns {object} */
    json() { return JSON.parse(this.response); }

    /** @returns {Blob} */
    blob() { return this.response; }

    /** @returns {string} */
    toObjectURL() { return (window.URL || window.webkitURL).createObjectURL(this.response); }

    /**
     * @param {number} code
     * @param {function} callback
     */
    onStatus(code, callback) {
        if(this.statusCode === code) {
            callback();
        }
    }
}

/**
 * @class
 * @classdesc Class intended to manage web requests
 */
class CjsRequest {
    #onStartCallback = function() {};
    #onEndCallback = function() {};
    #onErrorCallback = function() {};
    #onSuccessCallback = function() {};
    #onProgressCallback = function() {};

    /** @type {Object.<string, { data: *, statusCode: number, expiryTimestamp: number }>} */
    #cached = {};

    #getRequestCachedKey() {
        return "cjsrequest-" + JSON.stringify(this.body) + this.bodyKey + JSON.stringify(this.query) + JSON.stringify(this.headers);
    }

    #getCached = () => {
        if(localStorage.getItem(this.#getRequestCachedKey()) === null) return null;

        const value = JSON.parse(localStorage.getItem(this.#getRequestCachedKey()));
        const { data, expiryTimestamp } = value;

        if(new Date().getTime() > expiryTimestamp) return null;

        return data;
    }

    #hasCached = () => {
        if(localStorage.getItem(this.#getRequestCachedKey()) === null) return false;

        const value = JSON.parse(localStorage.getItem(this.#getRequestCachedKey()));
        const { expiryTimestamp } = value;

        if(new Date().getTime() > expiryTimestamp) return false;

        return true;
    }

    #setCached = (data, seconds) => {
        const expiryTimestamp = new Date().getTime() + (1000 * seconds);

        localStorage.setItem(this.#getRequestCachedKey(), JSON.stringify({ data, expiryTimestamp }));
    }

    #removeCached = () => {
        localStorage.removeItem(this.#getRequestCachedKey());
    }

    /**
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
        this.bodyKey = null;
        this.responseType = null;
        this.cacheSeconds = 0;
    }

    /**
     * Sets cache'ing time for an object, before it expiry and will be downloaded using full network request
     * @param {number} seconds 
     * @returns {CjsRequest}
     */
    setCacheSeconds(seconds = 10) {
        this.cacheSeconds = seconds;

        return this;
    }

    /**
     * Sets cache'ing time for an object, before it expiry and will be downloaded using full network request
     * @param {number} minutes 
     * @returns {CjsRequest}
     */
    setCacheMinutes(minutes = 5) {
        this.cacheSeconds = minutes * 60;

        return this;
    }
    
    /**
     * Sets cache'ing time for an object, before it expiry and will be downloaded using full network request
     * @param {number} hours 
     * @returns {CjsRequest}
     */
    setCacheHours(hours = 1) {
        this.cacheSeconds = hours * 60 * 60;
        
        return this;
    }

    /**
     * Sets body key, it's required when sending files and body at the same time
     * @param {string} bodyKey 
     * @returns {CjsRequest}
     */
    setBodyKey(bodyKey) {
        this.bodyKey = bodyKey;

        return this;
    }

    /**
     * Executes when request starts
     * @param {function} callback
     * @returns {CjsRequest}
     */
    onStart(callback) {
        this.#onStartCallback = callback;

        return this;
    }

    /**
     * Executes when request end
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
     * Sets the response type of the request
     * @param {"text"|"json"|"document"|"blob"|"arraybuffer"} responseType
     * @returns {CjsRequest}
     */
    setResponseType(responseType) {
        this.responseType = responseType;

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
     * Provides percentage status for progress (eg. uploading files)
     * @param {(percentage: number, loaded: number, total: number, event: ProgressEvent<EventTarget>) => void} callback 
     * @returns {CjsRequest}
     */
    onProgress(callback) {
        this.#onProgressCallback = callback;

        return this;
    }

    /**
     * Executes request
     * @return {Promise<CjsRequestResult>}
     */
    async doRequest() {
        const cacheEnabled = this.cacheSeconds > 0;
        
        if(cacheEnabled && this.#hasCached()) {
            const cached = this.#getCached();
            return new CjsRequestResult(cached.statusCode, cached.data, false);
        }

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

        url += `?${Object.keys(this.query).map(e => { return `${e}=${this.query[e]}` }).join("&")}`

        xhr.open(this.method, url, true);

        if(this.responseType) xhr.responseType = this.responseType;

        for(const [key, value] of Object.entries(this.headers)) {
            xhr.setRequestHeader(key, `${value}`);
        }

        const bodyExists = Object.keys(this.body).length > 0;
        const filesExists = Object.keys(this.files).length > 0;

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                let percentage = (e.loaded / e.total) * 100;

                this.#onProgressCallback(percentage, e.loaded, e.total, e);
            }
        };

        if(bodyExists || filesExists) {
            if(bodyExists && !filesExists) {
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(this.body));
            } else {
                const formData = new FormData();

                for (const [key, value] of Object.entries(this.files)) {
                    if (value instanceof FileList) {
                        for (const file of Array.from(value)) {
                            formData.append(key, file);
                        }
                    } else {
                        formData.append(key, value);
                    }
                }

                if(bodyExists && !this.bodyKey) {
                    console.log(`${CJS_PRETTY_PREFIX_X}Cannot send files and body data at the same time if bodyKey is not defined`);

                    return new CjsRequestResult(0, null, true);
                }
    
                if(bodyExists) formData.append(this.bodyKey, JSON.stringify(this.body));

                xhr.send(formData);
            }
        } else {
            xhr.send();
        }

        // if(bodyExists) {
        //     xhr.setRequestHeader("Content-Type", "application/json");

        //     xhr.send(JSON.stringify(this.body));
        // } else if(filesExists) {
        //     //xhr.setRequestHeader("Content-Type", "multipart/form-data");

        //     const formData = new FormData();

        //     for(const [key, value] of Object.entries(this.files)) {
        //         if(value instanceof FileList) {
        //             for(const file of Array.from(value)) {
        //                 formData.append(key, file);
        //             }
        //         }
        //     }

        //     xhr.send(formData);
        // } else {
        //     xhr.send();
        // }

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
                    xhr.response,
                    (xhr.status === 0)
                );

                if(xhr.readyState !== 4) return;

                this.#onEndCallback(requestResult);

                if(requestResult.isError()) {
                    this.#onErrorCallback(requestResult);
                } else {
                    this.#onSuccessCallback(requestResult);
                }

                if(cacheEnabled) {
                    this.#setCached({
                        data: xhr.response,
                        statusCode: xhr.status
                    }, this.cacheSeconds)
                }

                resolve(requestResult);
            }
        }))
    }

    /**
     * Sets query parameters in url like `?param=value&sort=ASC`
     * @param {Object.<string|number, any>} query
     * @return {CjsRequest}
     */
    setQuery(query) {
        this.query = query;

        return this;
    }

    /**
     * Sets headers like eg. `Authorization: Bearer TOKEN`
     * @param {Object.<string|number, any>} headers
     * @returns {CjsRequest}
     */
    setHeaders(headers) {
        this.headers = headers;

        return this;
    }

    /**
     * Sets body data
     * @param {object} body
     * @returns {CjsRequest}
     */
    setBody(body) {
        this.body = body;

        return this;
    }

    /**
     * Sets files
     * @param {Object.<string|number, any>} files
     * @returns {CjsRequest}
     */
    setFiles(files) {
        this.files = files;

        return this;
    }
}