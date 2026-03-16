/**
 * Returns parsed path that does not start with `./` or `/`
 */
export function toFixedPath(path: string): string {

    if (path.startsWith("./")) {
        return path.slice(2);
    }

    if (path.startsWith("/")) {
        return path.slice(1);
    }

    return path;
}