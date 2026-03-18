/**
 * Utility providing various functions that support window management
 */
export const CjsWindow = {

    /**
     * Opens a url within a new tab / target
     */
    open(
        href: string,
        target: "_blank" | "_self" | "_parent" | "_top" = "_blank"
    ): void {
        if (typeof document === "undefined") return;

        const a = document.createElement("a");

        a.href = href;
        a.target = target;
        a.style.display = "none";

        document.body.appendChild(a);

        a.click();
        a.remove();
    }

};