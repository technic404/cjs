
const ConsoleColors = {
    None: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m"
} as const;

const ConsoleColorsFormatMap: Record<string, string> = {
    "0": ConsoleColors.Black,
    "1": ConsoleColors.Blue,
    "2": ConsoleColors.Green,
    "3": ConsoleColors.Cyan,
    "4": ConsoleColors.Red,
    "5": ConsoleColors.Magenta,
    "6": ConsoleColors.Yellow,
    "7": ConsoleColors.White,
    "8": ConsoleColors.Dim,
    "9": ConsoleColors.Blue,

    "a": ConsoleColors.Green,
    "b": ConsoleColors.Cyan,
    "c": ConsoleColors.Red,
    "d": ConsoleColors.Magenta,
    "e": ConsoleColors.Yellow,
    "f": ConsoleColors.White,

    "l": ConsoleColors.Bright,
    "n": ConsoleColors.Underscore,
    "r": ConsoleColors.None
}

export const _ConsoleColorsUtil = {
    /**
     * `&0` black
     * `&1` dark blue
     * `&2` dark green
     * `&3` dark aqua
     * `&4` dark red
     * `&5` dark purple
     * `&6` gold
     * `&7` gray
     * `&8` dark gray
     * `&9` blue
     * `&a` green (lime)
     * `&b` aqua
     * `&c` red
     * `&d` light purple
     * `&e` yellow
     * `&f` white
     * `&r` reset
     * `&l` bold
     * `&n` underline
     * @param text 
     * @returns 
     */
    format(text: string): string {
        return text.replace(/&([0-9a-flnr])/gi, (_, code) => {
            return ConsoleColorsFormatMap[code.toLowerCase()] ?? "";
        }) + ConsoleColors.None;
    }
}