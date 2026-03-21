import { Credits } from "./Credits";
import { LanguageSelector } from "./LanguageSelector";
import { LeafletMap } from "./LeafletMap";
import { MapContent } from "./MapContent";
import { Results } from "./Results";
import { Wrapper } from "./Wrapper";
import { CjsLayout } from "cjs";

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