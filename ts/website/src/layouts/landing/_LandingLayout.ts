import { Credits } from "./Credits";
import { LanguageSelector } from "./LanguageSelector";
import { LeafletMap } from "./LeafletMap";
import { MapContent } from "./MapContent";
import { Wrapper } from "./Wrapper";
import { CjsLayout } from "cjs";
import {ResultsLayout} from "./results/_ResultsLayout";
import {LandingFiltersLayout} from "./filters/_LandingFiltersLayout";

export const LandingLayout = new CjsLayout(() =>
    [
        [Wrapper, [
            [LanguageSelector],
            [Credits],
            [LandingFiltersLayout],
            [MapContent, [
                [LeafletMap],
                [ResultsLayout]
            ]]
        ]]
    ]
);