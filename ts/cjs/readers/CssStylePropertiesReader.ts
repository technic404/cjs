import BaseReader from "./BaseReader";

class CssStylePropertiesReader extends BaseReader {
  override comment = {
    multipleLineEnabled: true,
    opening: "/*",
    closing: "*/",
    ignoreInString: true,
    singleLineEnabled: false,
    singleLine: "//",
  };

  /**
   * Css selector style
   */
  constructor(css: string) {
    super(css);
  }

  /**
   * Returns properties names and its values inside the css selector
   */
  read(): Record<string, string> {
    const replaceNewLines = (str: string): string => {
      return str.replaceAll("\n", "");
    };

    this.source = replaceNewLines(this.source);

    const properties: Record<string, string> = {};

    const tempProperty: {
      name: string;
      value: string;
      reading: "name" | "value";
      _parse: () => void;
      _reset: () => void;
    } = {
      name: "",
      value: "",
      reading: "name",
      _parse: () => {
        tempProperty.name = tempProperty.name.replaceAll(" ", "");
        tempProperty.value = tempProperty.value.trim();
      },
      _reset: () => {
        tempProperty.name = "";
        tempProperty.value = "";
        tempProperty.reading = "name";
      },
    };

    this._read((char: string) => {
      const { loop } = this;

      const endRead =
        char === ";" && !loop.string.opened && tempProperty.reading === "value";

      if (endRead) {
        tempProperty._parse();

        const { name, value } = tempProperty;

        properties[name] = value;

        tempProperty._reset();
        return;
      }

      const startReadValue =
        char === ":" && !loop.string.opened && tempProperty.reading === "name";

      if (startReadValue) {
        tempProperty.reading = "value";
        return;
      }

      const readValue = tempProperty.reading === "value";

      if (readValue) {
        tempProperty.value += char;
        return;
      }

      const readName = tempProperty.reading === "name";

      if (readName) {
        tempProperty.name += char;
      }
    });

    return properties;
  }
}

export default CssStylePropertiesReader;