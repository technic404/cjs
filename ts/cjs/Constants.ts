import { CjsLayout } from "./objects/CjsLayout";
import { Colors } from "./utils/ConsoleColorsUtil";

export const CJS_ID_LENGTH = 16;

export const CJS_PRETTY_PREFIX = `${Colors.Yellow}${Colors.Underscore}[CJS]${Colors.None} `;
export const CJS_PRETTY_PREFIX_X = `${CJS_PRETTY_PREFIX}${Colors.Red}✘ ${Colors.None}`;
export const CJS_PRETTY_PREFIX_V = `${CJS_PRETTY_PREFIX}${Colors.Green}✔ ${Colors.None}`;
export const CJS_PRETTY_PREFIX_I = `${CJS_PRETTY_PREFIX}${Colors.Yellow}⚠ ${Colors.None}`;

export const CJS_PREFIX = "c_js-";

export const CJS_STYLE_PREFIX = `${CJS_PREFIX}style-`;
export const CJS_STYLE_FILTERS_PREFIX = `${CJS_PREFIX}filters-`;
export const CJS_STYLE_KEYFRAMES_PREFIX = `${CJS_PREFIX}keyframes-`;
export const CJS_STYLE_PLUGINS_PREFIX = `${CJS_PREFIX}plugins-`;
export const CJS_ROOT_CONTAINER_PREFIX = `${CJS_PREFIX}root-`;
export const CJS_COMPONENT_PREFIX = `${CJS_PREFIX}component-`;
export const CJS_COMPONENT_FORCE_RENDER_PLACE_TAG = `cjsrender`;
export const CJS_LAYOUT_PREFIX = `${CJS_PREFIX}layout-`;
export const CJS_ELEMENT_PREFIX = `${CJS_PREFIX}element-`;
export const CJS_ELEMENT_DISABLED_PREFIX = `${CJS_PREFIX}elementdisabled-`;
export const CJS_OBSERVER_PREFIX = `${CJS_PREFIX}observer-`;
export const CJS_ELEMENT_ACTION_FILL_PREFIX = `${CJS_PREFIX}fill-`;

export const CjsLazyElementPrefix = `${CJS_PREFIX}lazy-`;
export const CjsLazyClassPrefix = "lazy:";

/**
 * Framework lifecycle hooks
 */
export interface CjsFrameworkEventsType {
    /**
     * Executes when layout is being loaded to component
     */
    onLoadLayout: (layout: CjsLayout) => void;
}

export const CjsFrameworkEvents: CjsFrameworkEventsType = {
    onLoadLayout: (layout: CjsLayout) => {}
};

/**
 * Tracks framework attributes already used
 */
export interface CjsTakenAttributesType {
    components: string[];
    layouts: string[];
    lazy: string[];
}

export const CjsTakenAttributes: CjsTakenAttributesType = {
    components: [],
    layouts: [],
    lazy: []
};

/**
 * Global framework namespace
 */
export const Cjs: Record<string, unknown> = {};

/**
 * Debug information
 */
export interface CjsDebugType {
    Style: {
        /** Displays all the media rules used on the website */
        Media: string[];
    };
}

export const CjsDebug: CjsDebugType = {
    Style: {
        Media: []
    }
};