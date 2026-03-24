import {CjsPluginManager, CjsSearch, init} from "cjs";
import { RootLayout } from "./layouts/root/_RootLayout";
import {ThemeUtil} from "./utils/ThemeUtil";
import {DashboardLayout, loadContent} from "./layouts/dashboard/_DashboardLayout";
import {AuthorsListLayout} from "./layouts/dashboard/authors/_AuthorsListLayout";
import {PublicationsListLayout} from "./layouts/dashboard/publications/list/_PublicationsListLayout";
import {SitesListLayout} from "./layouts/dashboard/sites/_SitesListLayout";
import {App} from "./requests/App";
import {PublicationOverviewLayout} from "./layouts/dashboard/publications/overview/_PublicationOverviewLayout";
import {AuthorOverviewLayout} from "./layouts/dashboard/authors/_AuthorsOverviewLayout";
import {SiteOverviewLayout} from "./layouts/dashboard/sites/_SiteOverviewLayout";

init(RootLayout);

CjsPluginManager.enable({
    notification: true
})

ThemeUtil.setTheme("light");

CjsSearch.onChange(async data => {
    if(CjsSearch.equals("/publications")) {
        return loadContent(PublicationsListLayout);
    }

    if(CjsSearch.equals("/authors")) {
        return loadContent(AuthorsListLayout);
    }

    if(CjsSearch.equals("/sites")) {
        return loadContent(SitesListLayout);
    }

    if(CjsSearch.startsWith("/publications") && CjsSearch.length === 2) {
        const publication = CjsSearch.get(1) === "new" ? null : await App.publications.get(CjsSearch.get<number>(1)!);

        loadContent(PublicationOverviewLayout.withData(publication));
    }

    if(CjsSearch.startsWith("/authors") && CjsSearch.length === 2) {
        const author = CjsSearch.get(1) === "new" ? null : await App.authors.get(CjsSearch.get<number>(1)!);

        loadContent(AuthorOverviewLayout.withData(author));
    }

    if(CjsSearch.startsWith("/sites") && CjsSearch.length === 2) {
        const site = CjsSearch.get(1) === "new" ? null : await App.archaeologicalSites.get(CjsSearch.get<number>(1)!);

        loadContent(SiteOverviewLayout.withData(site));
    }
});