import { _ConsoleColorsUtil } from "./utils/protected/_ConsoleColorsUtil";


export const CjsLazyClassPrefix = "lazy:"

// export const CJS_PRETTY_PREFIX = `${Colors.Yellow}${Colors.Underscore}[CJS]${Colors.None} `;
// export const CJS_PRETTY_PREFIX_X = `${CJS_PRETTY_PREFIX}${Colors.Red}✘ ${Colors.None}`;
// export const CJS_PRETTY_PREFIX_V = `${CJS_PRETTY_PREFIX}${Colors.Green}✔ ${Colors.None}`;
// export const CJS_PRETTY_PREFIX_I = `${CJS_PRETTY_PREFIX}${Colors.Yellow}⚠ ${Colors.None}`;

const _CjsPrefixBaseText = "[CJS]";

export const CjsPrefix = _ConsoleColorsUtil.format(`&e&n${_CjsPrefixBaseText}&r `);
export const CjsErrorPrefix = _ConsoleColorsUtil.format(`&c&n${_CjsPrefixBaseText}&r `);
export const CjsSuccessPrefix = _ConsoleColorsUtil.format(`&c&a${_CjsPrefixBaseText}&r `);
export const CjsInfoPrefix = _ConsoleColorsUtil.format(`&c&b${_CjsPrefixBaseText}&r `);

export const CjsComponentReRenderTag = "fx:render";
export const CjsRootTag = "cjsroot";

export const CjsEventAttributePrefix = "cjsevent-";