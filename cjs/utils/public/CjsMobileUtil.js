const CjsMobile = {
    /**
     * Performs basic check if user visited website on mobile device
     * @returns {boolean}
     */
    isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },
    /**
     * Checks if the user is on an iOS device
     * @returns {boolean}
     */
    isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
};