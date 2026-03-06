/**
 * Base asset resolver
 *
 * Example:
 * <img src={asset("images/user.png")} />
 */
export function asset(path: string): string {
    const fixed = toFixedPath(path);
    const basePath = `src/assets/${fixed}`;

    if (!cjsRunnable || !cjsRunnable.exists?.()) return basePath;

    const position = cjsRunnable.data?.relativePathPosition ?? 0;

    return "../".repeat(position) + basePath;
}

/**
 * Shortcut of asset method, by default adds `svg/` prefix and `.svg` suffix.
 */
export function svg(path: string): string {
    return asset(`svg/${path}.svg`);
}

/**
 * Shortcut of asset method, by default adds `images/` prefix and `.png` suffix.
 */
export function png(path: string): string {
    return asset(`images/${path}.png`);
}

/**
 * Shortcut of asset method, by default adds `images/` prefix and `.jpg` suffix.
 */
export function jpg(path: string): string {
    return asset(`images/${path}.jpg`);
}

/**
 * Shortcut of asset method, by default adds `gif/` prefix and `.gif` suffix.
 */
export function gif(path: string): string {
    return asset(`gif/${path}.gif`);
}