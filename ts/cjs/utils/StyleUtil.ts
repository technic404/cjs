import { cjsRunnable } from "../Runnable";
import { Colors } from "../utils/ConsoleColorsUtil";
import { CjsRequest } from "../utils/public/CjsRequestsUtil";
import CssReader from "../readers/CssReader";
import CssStylePropertiesReader from "../readers/CssStylePropertiesReader";
import { CJS_PRETTY_PREFIX_X, CJS_STYLE_PREFIX } from "../Constants";

type CjsStyleImportOptions = {
    prefixStyleRules?: boolean;
    encodeKeyframes?: boolean;
    enableMultiSelector?: boolean;
};

type CjsRunnableStyleWatcherEntry = {
    options: CjsStyleImportOptions;
    path: string;
};

export const CjsRunnableStyleWatcher = new Map<string, CjsRunnableStyleWatcherEntry>();


type CssProperties = Record<string, string>;

type RootVariablesType = {
  [key: string]: string | any;
  _addProperties: (properties: CssProperties) => void;
};

const CjsDebug = { Style: { Media: [] as string[] } };

const CjsCssMultisupportProperties: Record<string, string[]> = {
  "backdrop-filter": ["-webkit-backdrop-filter"],
};

const CjsStyle: {
  RootVariables: RootVariablesType;
  importStyle: (path: string) => Promise<void>;
} = {
  RootVariables: {
    _addProperties(properties: CssProperties) {
      for (const [name, value] of Object.entries(properties)) {
        (CjsStyle.RootVariables as any)[name.trim()] = value;
      }
    },
  },

  async importStyle(path: string) {
    const request = await new CjsRequest(path, "get").doRequest();

    if (request.isError()) {
      return console.log(
        `${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`
      );
    }

    const text = request.text();
    const style = document.head.querySelector(
      `[id="${CJS_STYLE_PREFIX}"]`
    ) as HTMLStyleElement;

    style.innerHTML += addPrefixToSelectors(text);
  },
};

/**
 * Prefix CSS selectors
 */
function addPrefixToSelectors(
  cssText: string,
  prefix: string = "",
  options: CjsStyleImportOptions = {
    prefixStyleRules: true,
    encodeKeyframes: true,
    enableMultiSelector: true,
  }
): string {
  const rules = new CssReader(cssText).read();
  let newRules: string[] = [];

  const getModifiedRules = (selector: string, cssText: string): string[] => {
    selector = selector.trim();
    const fullCssText = `${selector} { ${cssText} }`;

    if (selector.startsWith(":")) {
      const isRoot = selector.startsWith(":root");

      if (isRoot) {
        const properties = new CssStylePropertiesReader(cssText).read();
        CjsStyle.RootVariables._addProperties(properties);
      }

      return [fullCssText];
    }

    return selector
      .split(",")
      .map((sel) => {
        const selectorFirstChar = sel.trim().substring(0, 1);
        const isSelectorClassOrId =
          selectorFirstChar === "." || selectorFirstChar === "#";

        const selectors = [
          `${prefix}${isSelectorClassOrId ? "" : " "}${sel.trim()}`,
        ];

        if (!isSelectorClassOrId) {
          const selectorTextSplit = sel.split(" ");
          const firstTag = selectorTextSplit[0];
          const rawRestSelector = selectorTextSplit.slice(1).join(" ");

          const colonSelector = firstTag.includes(":")
            ? firstTag.slice(firstTag.indexOf(":"))
            : "";

          const parsedFirstTag = firstTag.replace(colonSelector, "");
          const restSelector = `${colonSelector} ${rawRestSelector}`;

          const commaSeparatedRemainingSelectors = restSelector
            .split(",")
            .map((e) => e.trim())
            .slice(1);

          const commaSeparatedSelectors = restSelector.includes(",")
            ? commaSeparatedRemainingSelectors.map((e) => {
                const parts = [
                  `${parsedFirstTag}${prefix}`,
                  `${e.replace(parsedFirstTag, "")}`,
                ];

                const createSpacing = !parts[1].startsWith(":");
                return parts.join(createSpacing ? " " : "");
              })
            : "";

          if (restSelector.includes(",")) {
            selectors.push(
              `${parsedFirstTag}${prefix}${restSelector.replace(
                commaSeparatedRemainingSelectors as any,
                commaSeparatedSelectors as any
              )}`
            );
          } else {
            selectors.push(`${parsedFirstTag}${prefix}${restSelector}`);
          }
        }

        return selectors;
      })
      .map((selectors) => `${selectors.join(", ")} { ${cssText} }`)
      .flat();
  };

  const getModifiedRulesInside = (
    selector: string,
    cssText: string
  ): string[] => {
    const rules = new CssReader(cssText).read();
    const newRules: string[] = [];

    for (const [selector, cssText] of Object.entries(rules)) {
      const properties = new CssStylePropertiesReader(cssText).read();

      for (const [name, value] of Object.entries(properties)) {
        if (!(name in CjsCssMultisupportProperties)) continue;

        for (const multisupportPropertyName of CjsCssMultisupportProperties[
          name
        ]) {
          if (multisupportPropertyName in properties) continue;
          properties[multisupportPropertyName] = value;
        }
      }

      const modifiedRules = getModifiedRules(selector, cssText);
      newRules.push(...modifiedRules);
    }

    return newRules;
  };

  for (const [selector, cssText] of Object.entries(rules)) {
    if (cssText.trim() === "") continue;

    const isMediaRule = selector.startsWith("@media");
    const isKeyFrameRule = selector.startsWith("@keyframes");
    const isRangeRule = selector.startsWith("@range");

    if (isRangeRule) {
      const parts = selector.split(" ");
      const determiner = parts[1];
      const value = parts[2];

      const mapping: Record<string, string> = {};

      const valueParts = (() => {
        let number = "";
        let unit = "";

        for (const char of value.split("")) {
          if (isNaN(Number(char))) unit += char;
          else number += char;
        }

        return { number: parseInt(number), unit };
      })();

      const { number, unit } = valueParts;

      mapping["<"] = `max-width: ${number - 1}${unit}`;
      mapping["<="] = `max-width: ${number}${unit}`;
      mapping[">"] = `min-width: ${number + 1}${unit}`;
      mapping[">="] = `min-width: ${number}${unit}`;

      const mediaCss = `@media only screen and (${
        mapping[determiner]
      }) { ${getModifiedRulesInside(selector, cssText).join("\n")} }`;

      CjsDebug.Style.Media.push(mediaCss);
      newRules.push(mediaCss);
      continue;
    }

    if (isMediaRule) {
      const mediaCss = `${selector} { ${getModifiedRulesInside(
        selector,
        cssText
      ).join("\n")} }`;

      CjsDebug.Style.Media.push(mediaCss);
      newRules.push(mediaCss);
      continue;
    }

    if (isKeyFrameRule) {
      newRules.push(`${selector} { ${cssText} }`);
      continue;
    }

    if (options.prefixStyleRules) {
      const modifiedRules = getModifiedRules(selector, cssText);
      newRules.push(...modifiedRules);
      continue;
    }

    newRules.push(cssText);
  }

  return newRules.join(" ").replaceAll("\n", "");
}

export { CjsStyle, addPrefixToSelectors };

export async function addRootStyle(
    selectorPrefix: string,
    path: string,
    options: CjsStyleImportOptions = {
        prefixStyleRules: true,
        encodeKeyframes: true,
        enableMultiSelector: true
    }
): Promise<void> {
    if (!("prefixStyleRules" in options)) options.prefixStyleRules = true;
    if (!("encodeKeyframes" in options)) options.encodeKeyframes = true;
    if (!("enableMultiSelector" in options)) options.enableMultiSelector = true;

    if (cjsRunnable.isStyleValid()) {
        CjsRunnableStyleWatcher.set(selectorPrefix, { options, path });
        return;
    }

    path = path.startsWith("./") ? path.slice(2) : path;

    const request = await new CjsRequest(path, "get").doRequest();

    if (request.isError()) {
        console.log(
            `${CJS_PRETTY_PREFIX_X}Error occurred while importing style (${Colors.Yellow}${path}${Colors.None})`
        );
        return;
    }

    const text = request.text();

    const style = document.head.querySelector<HTMLStyleElement>(
        `[id="${CJS_STYLE_PREFIX}"]`
    );

    if (!style) return;

    const prefixed = addPrefixToSelectors(text, `[${selectorPrefix}]`, options);

    style.innerHTML += prefixed;
}