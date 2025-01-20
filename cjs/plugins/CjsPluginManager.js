const CjsRipple = new CjsRipplePlugin();
const CjsNotification = new CjsNotificationPlugin();
const CjsScaleClick = new CjsScaleClickPlugin();
const CjsScaleHover = new CjsScaleHoverPlugin();

const CjsPluginManager = {
    /**
     * 
     * @param {{ ripple?: boolean, notification?: boolean, scaleClick?: boolean, scaleHover?: boolean }} plugins 
     */
    enable(plugins) {
        const mapping = {
            ripple: CjsRipple,
            notification: CjsNotification,
            scaleClick: CjsScaleClick,
            scaleHover: CjsScaleHover 
        }
        
        for(const [key, value] of Object.entries(plugins)) {
            const parsedKey = key.trim();

            if(!(parsedKey in mapping)) continue;

            /** @type {CjsPlugin} */
            const plugin = mapping[parsedKey];

            if(value) plugin.enable();
        }
    },
}