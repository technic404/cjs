import BaseReader from "./BaseReader";

class CssReader extends BaseReader {
  override comment = {
    multipleLineEnabled: true,
    opening: "/*",
    closing: "*/",
    ignoreInString: true,
    singleLineEnabled: false,
    singleLine: "//",
  };

  /**
   * Css text
   */
  constructor(css: string) {
    super(css);
  }

  /**
   * Provides selector with its contents
   */
  read(): Record<string, string> {
    const rules: Record<string, string> = {};
    let isBracketOpened = false;
    let nestedBrackets = 0;
    let tempText = "";
    let selector = "";

    const replaceNewLines = (str: string): string => {
      return str.replaceAll("\n", "");
    };

    this._read((char: string) => {
      const loop = this.loop;

      if (char === "{" && !isBracketOpened && !loop.string.opened) {
        isBracketOpened = true;
        selector = replaceNewLines(tempText);
        tempText = "";

        if (!(selector in rules)) rules[selector] = "";

        return;
      }

      if (!isBracketOpened) {
        tempText += char;
        return;
      }

      if (char === "{" && isBracketOpened && !loop.string.opened) {
        nestedBrackets++;
      }

      if (char === "}" && nestedBrackets > 0 && !loop.string.opened) {
        nestedBrackets--;
        tempText += char;
        return;
      }

      if (char === "}" && nestedBrackets === 0 && !loop.string.opened) {
        rules[selector] = replaceNewLines(tempText);
        selector = "";
        tempText = "";
        isBracketOpened = false;
        return;
      }

      tempText += char;
    });

    return rules;
  }
}

export default CssReader;