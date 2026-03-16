/**
 * Mobile detection utilities
 */
export const CjsMobile = {

    /**
     * Basic mobile device detection
     */
    isMobile(): boolean {
        if (typeof navigator === "undefined") return false;

        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },

    /**
     * Checks if user is on iOS device
     */
    isIOS(): boolean {
        if (typeof navigator === "undefined") return false;

        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

};