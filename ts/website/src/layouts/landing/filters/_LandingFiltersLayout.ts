
import {CjsLayout} from "cjs";
import {Column} from "../../../components/alignments/Column";
import {TwoSideRangeInput} from "../../../components/inputs/TwoSideRangeInput";
import {T} from "../../../utils/TranslationsUtil";
import {Text} from "../../../components/text/Text";
import {BaseInput} from "../../../components/inputs/BaseInput";
import {Row} from "../../../components/alignments/Row";
import {SmallCheckboxGroupInput} from "../../../components/inputs/SmallCheckboxGroupInput";
import {BoxCheckboxGroupInput} from "../../../components/inputs/BoxCheckboxGroupInput";
import {CulturalGroupIds} from "../../../constants";
import {VerticalCheckboxGroupInput} from "../../../components/inputs/VerticalCheckboxGroupInput";
import {Wrapper} from "./Wrapper";
import {Nav} from "./Nav";
import {Header} from "./Header";
import {Filters} from "./Filters";
import {Footer} from "./Footer";
import {ExtendButton} from "./ExtendButton";
export const LandingFiltersInputs = new CjsLayout(() =>
    [
        [Column.withStyle({ display: "flex", flexDirection: "column", gap: "8px" }), [
            [Text.withData({ content: T.p("chronology"), size: 18 })],
            [TwoSideRangeInput.withData({
                nameFrom: "_fromYear",
                nameTo: "_toYear",
                min: -30,
                max: 100,
                valueMin: 20,
                valueMax: 100,
                onInputFrom: (v) => {
                    document.body.querySelector<HTMLInputElement>("input[name='fromYear']")!
                        .valueAsNumber = v;
                },
                onInputTo: (v) => {
                    document.body.querySelector<HTMLInputElement>("input[name='toYear']")!
                        .valueAsNumber = v;
                }
            })],
            [Row.withStyle({ gap: "10px;" }), [
                [BaseInput.withData({
                    text: `${T.p("fromYear")}`,
                    name: "fromYear",
                    placeholder: `1998`,
                    type: "number"
                })],
                [BaseInput.withData({
                    text: `${T.p("toYear")}`,
                    name: "toYear",
                    placeholder: `2015`,
                    type: "number"
                })]
            ]],
            [Text.withData({ content: T.p("publicationType"), size: 18 })],
            [SmallCheckboxGroupInput.withData({
                name: "publicationTypes",
                checkboxes: [
                    {
                        title: T.p("article"),
                        // description: T.p("articleDescription"),
                        value: "article"
                    },
                    {
                        title: T.p("monograph"),
                        // description: T.p("monographDescription"),
                        value: "monograph"
                    },
                    {
                        title: T.p("chapter"),
                        // description: T.p("chapterDescription"),
                        value: "chapter"
                    },
                    {
                        title: T.p("report"),
                        // description: T.p("reportDescription"),
                        value: "report"
                    }
                ]
            })],
            [Text.withData({ content: T.p("publicationStatus"), size: 18 })],
            [BoxCheckboxGroupInput.withData({
                name: "publicationStatuses",
                checkboxes: [
                    {
                        title: T.p("published"),
                        description: T.p("publishedDescription"),
                        value: "published"
                    },
                    {
                        title: T.p("preprint"),
                        description: T.p("preprintDescription"),
                        value: "preprint"
                    }
                ]
            })],
            [Text.withData({ content: T.p("culturalGroup"), size: 18 })],
            [SmallCheckboxGroupInput.withData({
                name: "culturalGroup",
                checkboxes: [
                    {
                        title: T.p("scythians"),
                        value: CulturalGroupIds.Scythians
                    },
                    {
                        title: T.p("sarmatians"),
                        value: CulturalGroupIds.Sarmatians
                    },
                    {
                        title: T.p("cimmerians"),
                        value: CulturalGroupIds.Cimmerians
                    },
                    {
                        title: T.p("saka"),
                        value: CulturalGroupIds.Saka
                    }
                ]
            })],
            [Text.withData({ content: T.p("collectedDataTypes"), size: 18 })],
            [VerticalCheckboxGroupInput.withData({
                name: "collectedDataTypes",
                checkboxes: [
                    {
                        title: T.p("biologicalProfile"),
                        value: "biologicalProfile"
                    },
                    {
                        title: T.p("paleopathology"),
                        value: "paleopathology"
                    },
                    {
                        title: T.p("isotopes"),
                        value: "isotopes"
                    },
                    {
                        title: T.p("aDna"),
                        value: "aDna"
                    },
                    {
                        title: T.p("paleodemography"),
                        value: "paleodemography"
                    },
                    {
                        title: T.p("nonMetricFeatures"),
                        value: "nonMetricFeatures"
                    },
                    {
                        title: T.p("anthropologicalMeasurements"),
                        value: "anthropologicalMeasurements"
                    },
                    {
                        title: T.p("c14"),
                        value: "c14"
                    }
                ]
            })],
            [Text.withData({ content: T.p("numberOfIndividuals"), size: 18 })],
            [Row.withStyle({ gap: "10px;" }), [
                [BaseInput.withData({
                    text: `${T.p("minNumberOfIndividuals")}`,
                    name: "minNumberOfIndividuals",
                    placeholder: `10`,
                    type: "number"
                })],
                [BaseInput.withData({
                    text: `${T.p("maxNumberOfIndividuals")}`,
                    name: "maxNumberOfIndividuals",
                    placeholder: `67`,
                    type: "number"
                })]
            ]]
        ]]
    ]
);

export const LandingFiltersLayout = new CjsLayout(() =>
    [
        [Wrapper, [
            [Nav, [
                [Column, [
                    [Header],
                    [Filters, [
                        [LandingFiltersInputs]
                    ]],
                ]],
                [Footer]
            ]],
            [ExtendButton]
        ]]
    ]
);