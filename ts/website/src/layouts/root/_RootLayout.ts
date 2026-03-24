import { CjsComponent, CjsLayout } from "cjs";
import { Container } from "./Container";
import { Button } from "./Button";
import {LandingLayout} from "../landing/_LandingLayout";
import {DashboardLayout} from "../dashboard/_DashboardLayout";


export const RootLayout = new CjsLayout((data) => [
    [Container, [
        [DashboardLayout]
    ]]
]);

