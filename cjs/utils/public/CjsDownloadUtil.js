
/**
 * Downloads a file
 * @param {string} path
 * @param {string|null} filename
 */
async function download(path, filename = null) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            return console.log(`${CJS_PRETTY_PREFIX_X}Couldn't download file ${response.statusText}`);
        }

        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename ? filename : path.split('/').pop();

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.log(`${CJS_PRETTY_PREFIX_X}Error downloading file`, error);
    }
}

/**
 * Downloads file from the data
 * @param {any} data
 * @param {CommonMIMETypes} type
 * @param {string|null} filename
 * @returns {Promise<void>}
 */
async function downloadFile(data, type, filename = null) {
    try {
        const blob = new Blob([data], { type });
        const link = document.createElement('a');
        const extension = type.split('/').pop();
        link.href = URL.createObjectURL(blob);
        link.download = filename ? filename : `${extension}.${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.log(`${CJS_PRETTY_PREFIX_X}Error creating download file`, error);
    }
}