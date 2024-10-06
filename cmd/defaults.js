const Colors = {
	none: "\u001b[0m",
	underscore: "\u001b[4m",

	black: "\u001b[30m",
	red: "\u001b[31m",
	green: "\u001b[32m",
	yellow: "\u001b[33m",
	blue: "\u001b[34m",
	magenta: "\u001b[35m",
	cyan: "\u001b[36m",
	white: "\u001b[37m",
};

const Prefix = `${Colors.yellow}${Colors.underscore}[C.JS]${Colors.none} `;
const PrefixGreen = `${Colors.green}${Colors.underscore}[C.JS]${Colors.none} `;
const PrefixError = `${Colors.red}${Colors.underscore}[C.JS]${Colors.none} `;

module.exports = {
    Prefix: Prefix,
	PrefixError: PrefixError,
	PrefixGreen,
    Colors: Colors,
}