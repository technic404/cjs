import {Wrapper} from "./Wrapper";
import {LeftCorner} from "./LeftCorner";
import {Content} from "./Content";
import {ContentSection} from "./ContentSection";
import { CjsLayout } from "cjs";

export const DashboardTopNavLayout = new CjsLayout(() =>
    [
        [Wrapper, [
            [LeftCorner],
            [Content, [
                [ContentSection],
                [ContentSection]
            ]]
        ]]
    ]
);