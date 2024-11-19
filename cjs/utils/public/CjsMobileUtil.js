const CjsMobile = {
    /**
     * Performs basic check if user visited website on mobile device
     * @returns {boolean}
     */
    isMobile: () => {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
}