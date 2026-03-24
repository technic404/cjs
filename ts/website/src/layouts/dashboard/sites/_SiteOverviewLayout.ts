import {App} from "../../../requests/App";
import {CjsLayout, CjsNotification, CjsSearch, svg} from "cjs";
import {IconButton} from "../../../components/buttons/IconButton";
import {ArchaeologicalSite} from "../../../types";
import {Row} from "../../../components/alignments/Row";
import {Card} from "../../../components/dashboard/Card";
import {ArchaeologicalDataTable} from "../../../components/common/ArchaeologicalDataTable";
import {DataFormWrapper} from "../../../components/dashboard/DataFormWrapper";
import {VerticalCheckboxGroupInput} from "../../../components/inputs/VerticalCheckboxGroupInput";
import {Column} from "../../../components/alignments/Column";
import {Text} from "../../../components/text/Text";
import {T} from "../../../utils/TranslationsUtil";
import {BaseInput} from "../../../components/inputs/BaseInput";
import {ContentHeader} from "../../../components/dashboard/ContentHeader";
import {ContentWrapper} from "../../../components/dashboard/ContentWrapper";
import {SmallCheckboxGroupInput} from "../../../components/inputs/SmallCheckboxGroupInput";
import {CulturalGroupIds} from "../../../constants";

async function loadTable() {
    const sitesData = await App.archaeologicalSitesData.getBySite(
        CjsSearch.get<number>(1)!
    );

    return sitesData!.map(data => {
        return {
            data,
            prefixTd: [
                IconButton.render({
                    icon: svg('trash'),
                    danger: true,
                    click: async () => {
                        if(await App.archaeologicalSitesData.remove(data.id)) {
                            CjsNotification.success("Successfully removed site data");
                            SiteDataOverview.reRender();
                        }
                    }
                }),
                `#${data.id}`
            ],
            suffixTd: []
        }
    });
}

const SiteDataOverview = new CjsLayout((site: ArchaeologicalSite | null) =>
        [
            [Row.withStyle({ gap: "15px" }), [
                [Card.withStyle({ width: "100%", overflow: "auto" }).withData({ title: "Site analyzed data" }), [
                    [ArchaeologicalDataTable.withData({
                        prefixTh: ["", "ID"],
                        loadCallback: loadTable
                    })],
                ]],
                [Card.withStyle({ width: "80%" }).withData({ title: "Entry creator" }), [
                    [DataFormWrapper.withData({
                        serializeOptions: { checkboxesReadType: "array" },
                        saveCallback: async (data) => {

                            data.archaeologicalSiteId = CjsSearch.get<number>(1);

                            if(await App.archaeologicalSitesData.create(data)) {
                                CjsNotification.success("Successfully created site data");
                                SiteDataOverview.reRender();
                            }
                        }
                    }), [
                        [Column.withStyle({ gap: "8px" }), [
                            [Text.withData({ content: T.p("collectedDataTypes"), size: 18 })],
                            [VerticalCheckboxGroupInput.withStyle({  }).withData({
                                name: "data",
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
                            [BaseInput.withStyle({ width: "100%" }).withData({
                                text: "No. Individuals",
                                name: "analyzedPopulation",
                                placeholder: "ex. 6",
                                value: "",
                                type: "number"
                            })]
                        ]]
                    ]]
                ]]
            ]]
        ]
)

export const SiteOverviewLayout = new CjsLayout<ArchaeologicalSite | null>((site) =>
        [
            [ContentHeader.withData({ text: `Site ${site ? "overview" : "creation"}` }), [
                // [PublicationsSearch]
                // [TextIconButton.withData({
                //     text: "Create",
                //     icon: svg('plus'),
                //     click: () => Search.set("/publications/new"),
                //     fill: true
                // })]
            ]],
            [ContentWrapper, [
                [Card.withStyle({ width: "100%" }).withData({ title: "Site data" }), [
                    [DataFormWrapper.withData({
                        serializeOptions: { checkboxesReadType: "array" },
                        saveCallback: async (data) => {
                            data.culturalGroupId = data.culturalGroupId[0];

                            if(!site) {
                                const result = await App.archaeologicalSites.create(data);
                                if(result) {
                                    CjsSearch.set(`/sites/${result.id}`);
                                    CjsNotification.success("Successfully created site");
                                }
                                return;
                            }

                            if(await App.archaeologicalSites.edit(CjsSearch.get<number>(1)!, data)) {
                                CjsNotification.success("Successfully edited site");
                            }
                        }
                    }), [
                        [Row.withStyle({ gap: "8px" }), [
                            [BaseInput.withStyle({ width: "100%" }).withData({
                                text: "Name",
                                name: "name",
                                placeholder: "ex. Glinoe",
                                value: site ? site.name : "",
                            })],
                            [BaseInput.withStyle({ width: "100%" }).withData({
                                text: "Country",
                                name: "country",
                                placeholder: "ex. Moldova",
                                value: site ? site.country : "",
                            })]
                        ]],
                        [Text.withData({ content: T.p("culturalGroup"), size: 18 })],
                        [SmallCheckboxGroupInput.withData({
                            name: "culturalGroupId",
                            checked: site ? site.culturalGroupId : null,
                            mode: "single",
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
                        [Row.withStyle({ width: "100%", gap: "8px", marginTop: "4px" }), [
                            [BaseInput.withStyle({ width: "100%" }).withData({
                                text: "Latitude",
                                name: "lat",
                                placeholder: "ex. 46.6684",
                                value: site ? site.lat : "",
                                type: "number"
                            })],
                            [BaseInput.withStyle({ width: "100%" }).withData({
                                text: "Longitude",
                                name: "lng",
                                placeholder: "ex. 29.8001",
                                value: site ? site.lng : "",
                                type: "number"
                            })]
                        ]],
                        [Row.withStyle({ width: "100%", gap: "8px" }), [
                            [BaseInput.withStyle({ width: "100%" }).withData({
                                text: "Year dating from",
                                name: "yearDatingFrom",
                                placeholder: "ex. -4",
                                value: site ? site.yearDatingFrom : "",
                                type: "number"
                            })],
                            [BaseInput.withStyle({ width: "100%" }).withData({
                                text: "Year dating to",
                                name: "yearDatingTo",
                                placeholder: "ex. 6",
                                value: site ? site.yearDatingTo : "",
                                type: "number"
                            })]
                        ]]
                    ]]
                ]],
                !site ? null : [SiteDataOverview.withData(site)]
            ]]
        ]
);