import {TranslationsRequests} from "./channels/TranslationsRequests";
import {ArchaeologicalSitesRequests} from "./channels/ArchaeologicalSitesRequests";
import {PublicationsRequests} from "./channels/PublicationsRequests";
import {ArchaeologicalSitesDataRequests} from "./channels/ArchaeologicalSitesDataRequests";
import {AuthorsRequests} from "./channels/AuthorsRequests";


export const App = {
    translations: new TranslationsRequests(),
    archaeologicalSites: new ArchaeologicalSitesRequests(),
    publications: new PublicationsRequests(),
    archaeologicalSitesData: new ArchaeologicalSitesDataRequests(),
    authors: new AuthorsRequests(),
};