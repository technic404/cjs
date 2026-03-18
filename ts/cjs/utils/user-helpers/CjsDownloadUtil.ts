import { _CjsLoggerUtil } from "../protected/_CjsLoggerUtil";

/**
 * Global runtime state for the website
 */
export const CjsDownload = {
    async download(path: string, filename: string | null = null): Promise<void> {
        try {
            const response = await fetch(path);

            if (!response.ok) {
                return _CjsLoggerUtil.error(`Couldn't download file: ${response.statusText}`, response);
            }

            const blob = await response.blob();

            triggerDownload(blob, filename ?? path.split("/").pop());
        } catch (error) {
            return _CjsLoggerUtil.error(`Couldn't fetch file`, error);
        }
    },
    async downloadFile(data: BlobPart, mimeType: string, filename: string | null = null): Promise<void> {
        try {
            const blob = new Blob([data], { type: mimeType });
            const extension = mimeType.split("/").pop() ?? "file";
            const finalName = filename ?? `${extension}.${extension}`;

            triggerDownload(blob, finalName);
        } catch (error) {
            _CjsLoggerUtil.error(`Couldn't create download file`, error);
        }
    }
};

function triggerDownload(blob: Blob, filename: string | undefined): void {
    if (typeof document === "undefined") return;

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename ?? "download";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
}