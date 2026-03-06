

/**
 * Timing utilities
 */
export const CjsTimings = {

    /**
     * Creates a delay (sleep)
     */
    sleep(ms: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

};