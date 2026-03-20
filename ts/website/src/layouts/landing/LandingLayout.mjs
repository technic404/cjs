import {Wrapper} from "./Wrapper.ts";
import {MapContent} from "./MapContent.mjs";
import {Results} from "./Results.ts";
import {LeafletMap} from "./LeafletMap.mjs";
import {LanguageSelector} from "./LanguageSelector.mjs";
import {LandingFiltersLayout} from "../landingFilters/LandingFiltersLayout.mjs";
import {Credits} from "./Credits.mjs";

export const LandingLayout = new CjsLayout(() =>
    [
        [Wrapper, [
            [LanguageSelector],
            [Credits],
            [LandingFiltersLayout],
            [MapContent, [
                [LeafletMap],
                [Results]
            ]]
        ]]
    ]
);