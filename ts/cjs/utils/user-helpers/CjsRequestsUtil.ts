class CjsRequestResult<T = any> {
    constructor(
        private statusCode: number,
        private response: T,
        private networkError: boolean
    ) {}

    getStatusCode(): number {
        return this.statusCode;
    }

    isError(): boolean {
        return !String(this.statusCode).startsWith("2") || this.networkError;
    }

    isNetworkError(): boolean {
        return this.networkError;
    }

    text(): string {
        return this.response as any;
    }

    json(): T {
        return typeof this.response === "string"
            ? JSON.parse(this.response as string)
            : this.response
    }

    blob(): Blob {
        return this.response as Blob;
    }

    toObjectURL(): string {
        return (window.URL || window.webkitURL)
            .createObjectURL(this.response as Blob);
    }

    getTranslation(): string {
        const codes: Record<number, string> = {
            200: "Pomyślnie wykonano operację",
            400: "Niepoprawne dane",
            401: "Brak autoryzacji",
            403: "Brak uprawnień",
            404: "Nie znaleziono",
            500: "Błąd serwera"
        };

        return codes[this.statusCode] ?? (
            this.isError()
                ? "Błąd wykonania operacji"
                : "Pomyślnie wykonano operację"
        );
    }

    onStatus(code: number, callback: () => void): void {
        if (this.statusCode === code) {
            callback();
        }
    }
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | string;
type ResponseType = "text" | "json" | "document" | "blob" | "arraybuffer";

type Callback<T> = (result: CjsRequestResult<T>) => void;

export class CjsRequest<TResponse = any> {

    private onStartCallback: () => void = () => {};
    private onEndCallback: Callback<TResponse> = () => {};
    private onErrorCallback: Callback<object> = () => {};
    private onSuccessCallback: Callback<TResponse> = () => {};
    private onProgressCallback:
        (percentage: number, loaded: number, total: number, e: ProgressEvent) => void
        = () => {};

    private cachedKeyPrefix = "cjsrequest-";

    private query: Record<string, any> = {};
    private body: Record<string, any> = {};
    private headers: Record<string, any> = {};
    private files: Record<string, any> = {};

    private bodyKey: string | null = null;
    private cooldown = 0;
    private cacheSeconds = 0;

    private responseType: ResponseType | null = null;

    constructor(
        private url: string,
        private method: RequestMethod
    ) {}

    private getCacheKey(): string {
        return this.cachedKeyPrefix +
            JSON.stringify(this.body) +
            this.bodyKey +
            JSON.stringify(this.query) +
            JSON.stringify(this.headers);
    }

    private getCached(): { statusCode: number; data: any } | null {
        if (typeof localStorage === "undefined") return null;

        const raw = localStorage.getItem(this.getCacheKey());
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        if (Date.now() > parsed.expiryTimestamp) return null;

        return parsed;
    }

    private setCached(data: any, seconds: number) {
        const expiryTimestamp = new Date().getTime() + (1000 * seconds);

        localStorage.setItem(this.getCacheKey(), JSON.stringify({ data, expiryTimestamp }));
    }

    private buildUrl(): string {
        const queryKeys = Object.keys(this.query);

        if (queryKeys.length === 0) return this.url;

        const params = queryKeys
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.query[key])}`)
            .join("&");

        return `${this.url}?${params}`;
    }

    private sendBodyOrFiles(xhr: XMLHttpRequest): void {
        const hasBody = Object.keys(this.body).length > 0;
        const hasFiles = Object.keys(this.files).length > 0;

        if (hasBody || hasFiles) {

            if (hasBody && !hasFiles) {

                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(this.body));

            } else {

                const formData = new FormData();

                Object.entries(this.files).forEach(([key, value]) => {

                    if (value instanceof FileList) {
                        Array.from(value).forEach(file =>
                            formData.append(key, file)
                        );
                    } else {
                        formData.append(key, value as any);
                    }
                });

                if (hasBody && !this.bodyKey) {
                    console.error("BodyKey required when sending files + body");
                    xhr.send(formData);
                    return;
                }

                if (hasBody && this.bodyKey) {
                    formData.append(this.bodyKey, JSON.stringify(this.body));
                }

                xhr.send(formData);
            }

        } else {
            xhr.send();
        }
    }

    setQuery(query: Record<string, any>): this {
        this.query = query;
        return this;
    }

    setHeaders(headers: Record<string, any>): this {
        this.headers = headers;
        return this;
    }

    setBody(body: Record<string, any>): this {
        this.body = body;
        return this;
    }

    setFiles(files: Record<string, any>): this {
        this.files = files;
        return this;
    }

    setBodyKey(key: string): this {
        this.bodyKey = key;
        return this;
    }

    setCacheSeconds(seconds: number): this {
        this.cacheSeconds = seconds;
        return this;
    }

    setCacheMinutes(minutes: number): this {
        this.cacheSeconds = minutes * 60;
        return this;
    }

    setCacheHours(hours: number): this {
        this.cacheSeconds = hours * 60 * 60;
        return this;
    }

    setResponseType(responseType: ResponseType) {
        this.responseType = responseType;
        return this;
    }

    onStart(callback: () => any) {
        this.onStartCallback = callback;
        return this;
    }

    onEnd(callback: Callback<TResponse>) {
        this.onEndCallback = callback;
        return this;
    }

    onError(callback: Callback<any>) {
        this.onErrorCallback = callback;
        return this;
    }

    onSuccess(callback: () => any) {
        this.onStartCallback = callback;
        return this;
    }

    onProgress(callback: (precentage: number, loaded: number, total: number, event: ProgressEvent) => void) {
        this.onProgressCallback = callback;
        return this;
    }

    async doRequest(): Promise<CjsRequestResult<TResponse | null>> {
        if (this.cacheSeconds > 0) {
            const cached = this.getCached();

            if (cached) {
                return new CjsRequestResult<TResponse>(
                    cached.statusCode,
                    cached.data,
                    false
                );
            }
        }

        if (this.cooldown > 0) {
            await new Promise(res => setTimeout(res, this.cooldown));
        }

        const xhr = new XMLHttpRequest();
        xhr.open(this.method.toUpperCase(), this.buildUrl(), true);

        if (this.responseType) {
            xhr.responseType = this.responseType;
        }

        Object.entries(this.headers).forEach(([k, v]) => {
            xhr.setRequestHeader(k, String(v));
        });

        this.onStartCallback();

        const result = await new Promise<CjsRequestResult<TResponse>>((resolve) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;

                const result = new CjsRequestResult<TResponse>(
                    xhr.status,
                    xhr.response,
                    xhr.status === 0
                );

                this.onEndCallback(result);

                if (result.isError()) {
                    this.onErrorCallback(result as CjsRequestResult<object>);
                } else {
                    this.onSuccessCallback(result);
                }

                if (this.cacheSeconds > 0) {
                    this.setCached({
                        data: xhr.response,
                        statusCode: xhr.status
                    }, this.cacheSeconds);
                }

                resolve(result);
            };

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    let percentage = (e.loaded / e.total) * 100;

                    this.onProgressCallback(percentage, e.loaded, e.total, e);
                }
            }

            xhr.onerror = () => {
                const result = new CjsRequestResult<object>(0, null as any, true);
                this.onErrorCallback(result);
                resolve(null);
            };

            this.sendBodyOrFiles(xhr);
        });

        return result;
    }
}

export const CjsRequests = {
    clearCache(): void {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key?.startsWith("cjsrequest-")) {
                localStorage.removeItem(key);
            }
        }
    }
};