class CjsWebSocket {
    constructor() {
        /** @type {WebSocket} */
        this.webSocket = null;
        this.captures = new Map(); // captureId, callback
        this.isOpened = false;
        this.waitingSendRequests = [];
    }

    /**
     * Connects to WebSocket
     * @param {string} url ws://address:port/
     * @returns {CjsWebSocket}
     */
    connect(url) {
        this.webSocket = new WebSocket(url);

        this.webSocket.onopen = () => {
            this.isOpened = true;

            this.waitingSendRequests.forEach(data => {
                this.webSocket.send(data);
            })
        }

        this.webSocket.onmessage = (event) => {
            Array.from(this.captures.values()).forEach(captureFunction => {
                captureFunction(event);
            })
        }

        this.webSocket.onclose = (event) => {
            
        }

        return this;
    }

    /**
     * Sends data to WebSocket
     * @param {*} data
     * @returns {CjsWebSocket}
     */
    send(data) {
        if(!this.isOpened) {
            this.waitingSendRequests.push(data);

            return this;
        }

        this.webSocket.send(data);

        return this;
    }

    /**
     * Sets data as json to WebSocket (uses JSON.stringify(...))
     * @param {object} json
     * @returns {CjsWebSocket}
     */
    sendJson(json) {
        this.send(JSON.stringify(json));

        return this;
    }

    /**
     * Creates capture, when any message is received the capture will provide its content
     * @param {function(MessageEvent)} callback
     * @returns {string} id of the created capture
     */
    createCapture(callback) {
        const id = getRandomCharacters(16);

        this.captures.set(id, callback);

        return id;
    }

    /**
     * Removes capture
     * @param {string} id
     * @returns {CjsWebSocket}
     */
    removeCapture(id) {
        this.captures.delete(id);

        return this;
    }

    /**
     * Checks is capture exists
     * @param {string} id
     * @returns {boolean}
     */
    hasCapture(id) {
        return this.captures.has(id);
    }
}