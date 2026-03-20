import { TranslationsRequests } from "./channels/TranslationsRequests";
import { ArchaeologicalSitesRequests } from "./channels/ArchaeologicalSitesRequests.mjs";
import { PublicationsRequests } from "./channels/PublicationsRequests.mjs";
import { ArchaeologicalSitesDataRequests } from "./channels/ArchaeologicalSitesDataRequests";
import { AuthorsRequests } from "./channels/AuthorsRequests.mjs";


export const App = {
    translations: new TranslationsRequests(),
    archaeologicalSites: new ArchaeologicalSitesRequests(),
    publications: new PublicationsRequests(),
    archaeologicalSitesData: new ArchaeologicalSitesDataRequests(),
    authors: new AuthorsRequests(),
};