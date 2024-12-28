
/**
 * Downloads a file
 * @param {string} path
 * @param {string} filename
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