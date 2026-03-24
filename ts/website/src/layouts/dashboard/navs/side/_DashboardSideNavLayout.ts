import {Wrapper} from "./Wrapper";
import {Sections} from "./Sections";
import {Latest} from "./Latest";
import {Footer} from "./Footer";
import {Section} from "./Section";
import {CjsLayout, svg} from "cjs";

export const DashboardSideNavLayout = new CjsLayout(() =>
    [
        [Wrapper, [
            [Sections, [
                [Section.withData({ text: "Publications", icon: svg("monograph"), path: "/publications", isActive: true })],
                [Section.withData({ text: "Authors", icon: svg("users"), path: "/authors" })],
                [Section.withData({ text: "Archaeological sites", icon: svg("ancient-pavilion"), path: "/sites" })]
            ]],
            [Latest],
            [Footer]
        ]]
    ]
);