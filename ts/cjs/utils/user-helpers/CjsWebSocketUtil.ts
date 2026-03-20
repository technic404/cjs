import { CjsStringUtil } from "../public/CjsStringUtil";

type CaptureCallback = (event: MessageEvent) => void;

/**
 * WebSocket wrapper utility
 */
export class CjsWebSocket {

    private webSocket: WebSocket | null = null;
    private captures: Map<string, CaptureCallback> = new Map();
    private isOpened = false;
    private waitingSendRequests: (string | ArrayBuffer | Blob)[] = [];

    /**
     * Connects to WebSocket
     */
    connect(url: string): this {
        this.webSocket = new WebSocket(url);

        this.webSocket.onopen = () => {

            this.isOpened = true;

            // Send queued messages
            this.waitingSendRequests.forEach(data => {
                this.webSocket?.send(data);
            });

            this.waitingSendRequests = [];
        };

        this.webSocket.onmessage = (event: MessageEvent) => {

            // Forward message to all captures
            for (const callback of this.captures.values()) {
                callback(event);
            }
        };

        this.webSocket.onclose = () => {
            this.isOpened = false;
        };

        return this;
    }

    /**
     * Sends raw data to WebSocket
     */
    send(data: string | ArrayBuffer | Blob): this {
        if (!this.isOpened || !this.webSocket) {
            this.waitingSendRequests.push(data);
            return this;
        }

        this.webSocket.send(data);
        return this;
    }

    /**
     * Sends JSON data (auto stringified)
     */
    sendJson(json: unknown): this {
        return this.send(JSON.stringify(json));
    }

    /**
     * Creates a capture.
     * When any message is received — the callback executes.
     *
     * @returns capture id
     */
    createCapture(callback: CaptureCallback): string {
        const id = CjsStringUtil.getRandom(16);

        this.captures.set(id, callback);

        return id;
    }

    /**
     * Removes capture
     */
    removeCapture(id: string): this {
        this.captures.delete(id);
        return this;
    }

    /**
     * Checks if capture exists
     */
    hasCapture(id: string): boolean {
        return this.captures.has(id);
    }

    /**
     * Closes websocket safely
     */
    close(code?: number, reason?: string): void {
        this.webSocket?.close(code, reason);
        this.webSocket = null;
        this.isOpened = false;
    }
}