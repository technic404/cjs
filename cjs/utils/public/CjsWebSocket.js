class CjsWebSocket {
    constructor() {
        /**
         * @type {WebSocket}
         */
        this.webSocket = null;
        this.captures = new Map(); // captureId, callback
        this.isOpened = false;
        this.waitingSendRequests = [];
    }

    /**
     *
     * @param {String} url ws://address:port/
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
     *
     * @param data
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
     *
     * @param {Object} json
     * @returns {CjsWebSocket}
     */
    sendJson(json) {
        this.send(JSON.stringify(json));

        return this;
    }

    /**
     *
     * @param {function(MessageEvent)} callback
     * @returns {String} id of the created capture
     */
    createCapture(callback) {
        const id = getRandomCharacters(16);

        this.captures.set(id, callback);

        return id;
    }

    /**
     *
     * @param {String} id
     * @returns {CjsWebSocket}
     */
    removeCapture(id) {
        this.captures.delete(id);

        return this;
    }

    /**
     *
     * @param {String} id
     * @returns {Boolean}
     */
    hasCapture(id) {
        return this.captures.has(id);
    }
}