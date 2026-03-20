type ThemeName = "light" | "dark";

interface ThemeColors {
    [key: string]: string;
}

const Themes: Record<ThemeName, ThemeColors> = {
    light: {
        "--light": "#ffffff",
        "--light-50": "#fcfcfc",
        "--light-100": "#f8f8f8",
        "--light-200": "#ececec",
        "--light-300": "#d5d5d5",
        "--light-400": "#cbcbcb",
        "--light-500": "#8d8d8d",
        "--light-blue-100": "#f5f7f9",
        "--dark-100": "#181818",
        "--dark-200": "#343434",
        "--dark-300": "#464646",
        "--dark-400": "#626262",
        "--dark-500": "#808080",
        "--filter-green-100": "",
        "--filter-white-100": "invert(100%) brightness(5)",
        "--filter-black-100": "invert(0%) brightness(0%)",
        "--dark-font-regular": "SourceSans3-SemiBold",
        "--shadow-25": "rgba(128, 128, 128, 0.25)",
        "--shadow-50": "rgba(128, 128, 128, 0.5)",
        "--background-l-100-d-300": "#f8f8f8",
    },
    dark: {
        "--light": "#000000",
        "--light-50": "#0c0c0c",
        "--light-100": "#131313",
        "--light-200": "#1a1a1a",
        "--light-300": "#282828",
        "--light-400": "#3a3a3a",
        "--light-500": "#7c7c7c",
        "--dark-100": "#f8f8f8",
        "--dark-200": "#e5e5e5",
        "--dark-300": "#bdbdbd",
        "--dark-400": "#a8a8a8",
        "--dark-500": "#858585",
        "--light-blue-100": "#1a1d21",
        "--filter-green-100":
            "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)",
        "--filter-white-100": "invert(0%) brightness(0%)",
        "--filter-black-100": "invert(100%) brightness(5)",
        "--dark-font-regular": "SourceSans3-Regular",
        "--shadow-25": "rgba(21,21,21,0.25)",
        "--shadow-50": "rgba(21,21,21,0.5)",
        "--background-l-100-d-300": "#282828",
    },
};

const Shared: ThemeColors = {
    "--const-filter-white": "invert(100%) brightness(5)",
    "--const-filter-black": "invert(0%) brightness(0%)",
    "--const-filter-orange":
        "invert(48%) sepia(79%) saturate(2476%) hue-rotate(0deg) brightness(118%) contrast(119%)",
    "--const-filter-red":
        "invert(16%) sepia(94%) saturate(7481%) hue-rotate(357deg) brightness(98%) contrast(119%)",
    "--const-filter-green":
        "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)",
    "--const-filter-blue":
        "invert(47%) sepia(95%) saturate(2200%) hue-rotate(190deg) brightness(100%) contrast(105%)",
    "--base": "#1E90FFFF",
    "--base-100": "#168fff",
    "--base-100-dark-10": "#1586ee",
    "--base-100-dark-20": "#1277d7",
    "--base-100-dark-30": "#106dc5",
    "--base-100-dark-40": "#0e62b0",
    "--base-100-dark-50": "#0d569b",
    "--base-100-dark-100": "#0b447c",
    "--base-100-opacity": "rgba(22,143,255,0.33)",
    "--base-100-opacity-01": "rgba(22,143,255,0.1)",
    "--base-100-opacity-02": "rgba(22,143,255,0.2)",
};

declare const Android: { changeTheme(themeName: ThemeName): void };

class Theme {
    loadTheme(): void {
        const root = document.documentElement;

        const themeColors = Themes[this.getTheme()];
        for (const [name, value] of Object.entries(themeColors)) {
            root.style.setProperty(name, value);
        }

        for (const [name, value] of Object.entries(Shared)) {
            root.style.setProperty(name, value);
        }
    }

    setTheme(themeName: ThemeName): void {
        localStorage.setItem("theme", themeName);
        this.loadTheme();

        try {
            Android.changeTheme(themeName);
        } catch {
            // Ignore if not available
        }
    }

    getTheme(): ThemeName {
        const theme = localStorage.getItem("theme") as ThemeName | null;
        if (!theme || !(theme in Themes)) return "light";
        return theme;
    }
}

export const ThemeUtil = new Theme();