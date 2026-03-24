export function formatDate(format: string, date: Date): string {
    const map: Record<string, number | string> = {
        YYYY: date.getFullYear(),
        YY: String(date.getFullYear()).slice(-2),
        MM: String(date.getMonth() + 1).padStart(2, "0"),
        M: date.getMonth() + 1,
        DD: String(date.getDate()).padStart(2, "0"),
        D: date.getDate(),
        HH: String(date.getHours()).padStart(2, "0"),
        H: date.getHours(),
        mm: String(date.getMinutes()).padStart(2, "0"),
        m: date.getMinutes(),
        ss: String(date.getSeconds()).padStart(2, "0"),
        s: date.getSeconds(),
    };

    return format.replace(
        /YYYY|YY|MM|M|DD|D|HH|H|mm|m|ss|s/g,
        (match) => String(map[match])
    );
}