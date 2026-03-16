import { CjsRipplePlugin } from "./modules/CjsRipplePlugin";
import { CjsScaleClickPlugin } from "./modules/CjsScaleClickPlugin";
import { CjsNotificationPlugin } from "./modules/CjsNotificationPlugin";
import { CjsScaleHoverPlugin } from "./modules/CjsScaleHoverPlugin";

export const CjsRipple = new CjsRipplePlugin();
export const CjsNotification = new CjsNotificationPlugin();
export const CjsScaleClick = new CjsScaleClickPlugin();
export const CjsScaleHover = new CjsScaleHoverPlugin();

export interface CjsPluginConfig {
    ripple?: boolean;
    notification?: boolean;
    scaleClick?: boolean;
    scaleHover?: boolean;
}

type PluginInstance = {
    enable: () => void;
};

export const CjsPluginManager = {

    /**
     * Enables selected plugins
     */
    enable(plugins: CjsPluginConfig = {}): void {
        const mapping: Record<keyof CjsPluginConfig, PluginInstance> = {
            ripple: CjsRipple,
            notification: CjsNotification,
            scaleClick: CjsScaleClick,
            scaleHover: CjsScaleHover
        };

        for (const key of Object.keys(mapping) as Array<keyof CjsPluginConfig>) {

            if (!plugins[key]) continue;

            mapping[key].enable();
        }
    }
};