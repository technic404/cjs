const CjsRipple = new CjsRipplePlugin();
const CjsNotification = new CjsNotificationPlugin();

const CjsPluginManager = {
    /**
     * 
     * @param {{ ripple?: boolean, notification?: boolean }} plugins 
     */
    enable(plugins) {
        const mapping = {
            ripple: CjsRipple,
            notification: CjsNotification
        }
        
        for(const [key, value] of Object.entries(plugins)) {
            const parsedKey = key.toLowerCase().trim();

            if(!(parsedKey in mapping)) continue;

            /** @type {CjsPlugin} */
            const plugin = mapping[parsedKey];

            if(value) plugin.enable();
        }
    },
}