import {CjsLayout} from "cjs";
import {Wrapper} from "./Wrapper";
import {Column} from "../../components/alignments/Column";
import {Row} from "../../components/alignments/Row";
import { Content } from "./Content";
import {DashboardTopNavLayout} from "./navs/top/_DashboardTopNavLayout";
import {DashboardSideNavLayout} from "./navs/side/_DashboardSideNavLayout";

export const DashboardLayout = new CjsLayout(() => [
    [Wrapper, [
        [Column.withStyle({ height: "100%", width: "100%" }), [
            [DashboardTopNavLayout],
            [Row.withStyle({ height: "calc(100% - 50px);" }), [
                [DashboardSideNavLayout],
                [Content, [

                ]]
            ]],
        ]]
    ]]
])

export function loadContent(layout: CjsLayout) {
    Content.loadLayout(layout);
}