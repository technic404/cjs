const CJS_ID_LENGTH = 16;

const CJS_PRETTY_PREFIX = `${Colors.Yellow}${Colors.Underscore}[CJS]${Colors.None} `;
const CJS_PRETTY_PREFIX_X = `${CJS_PRETTY_PREFIX}${Colors.Red}✘ ${Colors.None}`;
const CJS_PRETTY_PREFIX_V = `${CJS_PRETTY_PREFIX}${Colors.Green}✔ ${Colors.None}`;
const CJS_PRETTY_PREFIX_I = `${CJS_PRETTY_PREFIX}${Colors.Yellow}⚠ ${Colors.None}`;

const CJS_PREFIX = "c_js-";

const CJS_STYLE_PREFIX = `${CJS_PREFIX}style-`;
const CJS_STYLE_FILTERS_PREFIX = `${CJS_PREFIX}filters-`
const CJS_STYLE_KEYFRAMES_PREFIX = `${CJS_PREFIX}keyframes-`
const CJS_ROOT_CONTAINER_PREFIX = `${CJS_PREFIX}root-`;
const CJS_COMPONENT_PREFIX = `${CJS_PREFIX}component-`
const CJS_ELEMENT_PREFIX = `${CJS_PREFIX}element-`
const CJS_ELEMENT_DISABLED_PREFIX = `${CJS_PREFIX}elementdisabled-`
const CJS_OBSERVER_PREFIX = `${CJS_PREFIX}observer-`

const CjsFrameworkEvents = { 
    /**
     * Executes when layout is being loaded to component
     * @param {CjsLayout} layout
     */
    onLoadLayout: (layout) => {}
}