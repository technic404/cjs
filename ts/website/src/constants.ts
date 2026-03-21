
export const ApiUrl = "http://127.0.0.1:3000/api";

export const Languages: Record<string, string> = {
    pl: "Polski",
    en: "English",
    ru: "Русский"
}

export const CulturalGroups: Record<number, string> = {
    1: "scythians",
    2: "sarmatians",
    3: "cimmercians",
    4: "saka"
}

export const CulturalGroupIds: Record<string, number> = {
    Scythians: 1,
    Sarmatians: 2,
    Cimmerians: 3,
    Saka: 4
}

export const DataTypes = [
    "biologicalProfile",
    "paleopathology",
    "isotopes",
    "aDna",
    "paleodemography",
    "nonMetricFeatures",
    "anthropologicalMeasurements",
    "c14"
];