export type LanguageTag = "pl" | "en" | "ru";

export enum PublicationType {
    Article = "article",
    Monograph = "monograph",
    Chapter = "chapter",
    Report = "report",
}

export enum PublicationStatus {
    Published = "published",
    Preprint = "preprint",
}

export interface ArchaeologicalSite {
    id: number;
    name: string;
    country: string;
    lat: number;
    lng: number;
    yearDatingFrom: number;
    yearDatingTo: number;
    culturalGroupId: number;
    createdAt: number;
    updatedAt: number;
}

export interface Publication {
    id: number;
    redactorId: number;
    authorIds: number[];
    year: number;
    title: string;
    volume: string;
    summary: string;
    archaeologicalSiteDataIds: number[];
    publicationType: PublicationType;
    publicationStatus: PublicationStatus;
    sourceAddress: string;
    doi: string;
    isbn: string;
    verifiedAt: number;
    createdAt: number;
    updatedAt: number;
}

export interface ArchaeologicalSiteData {
    id: number;
    archaeologicalSiteId: number;
    data: string[];
    analyzedPopulation: number;
    createdAt: number;
    updatedAt: number;
}

export interface Author {
    id: number;
    firstname: string;
    lastname: string;
    createdAt: number;
    updatedAt: number;
}