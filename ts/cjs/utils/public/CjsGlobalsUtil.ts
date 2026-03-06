export interface CjsGlobalsOptions {
    mouse: {
        /** determinates if mouse is not clicked (up) */
        up: boolean; 
        /** determinates if mouse is clicked (down) */
        down: boolean;
        /** defines in which state is the mouse */
        state: "up" | "down";
    };

    window: {
        DOMContentLoaded: boolean;
    };
}

/**
 * Global runtime state for the website
 */
export const CjsGlobals: CjsGlobalsOptions = {
    mouse: {
        up: true,
        down: false,
        state: "up"
    },

    window: {
        DOMContentLoaded: false
    }

};

/* ------------------------------------------------ */
/* Event listeners                                  */
/* ------------------------------------------------ */

window.addEventListener("mousedown", () => {
    CjsGlobals.mouse.up = false;
    CjsGlobals.mouse.down = true;
    CjsGlobals.mouse.state = "down";
});

window.addEventListener("mouseup", () => {
    CjsGlobals.mouse.up = true;
    CjsGlobals.mouse.down = false;
    CjsGlobals.mouse.state = "up";
});

window.addEventListener("DOMContentLoaded", () => {

    CjsGlobals.window.DOMContentLoaded = true;
});