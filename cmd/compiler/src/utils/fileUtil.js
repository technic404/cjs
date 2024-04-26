const fs = require("fs");
const path = require('path');

function getRecursivelyDirectoryFiles(dir, filter = "") {
	let files = [];

	fs.readdirSync(dir).forEach((file) => {
		const absolutePath = path.join(dir, file);
		const isDirectory = fs.statSync(absolutePath).isDirectory();

		if (!isDirectory && !file.endsWith(filter)) return;

		files.push(
			isDirectory
				? getRecursivelyDirectoryFiles(absolutePath, filter)
				: absolutePath
		);
	});

	return files.flat();
}

/**
 * Combines a path, so if path1 is "./src/components/target/Target.mjs" and path2 is "../../parts/somePart/SomeHandler.mjs" the resulted path will be "./src/parts/somePart/SomeHandler.mjs"
 * @param {String} path1
 * @param {String} path2
 * @returns {String}
 */
function getCombinedPath(path1, path2) {
	const splits = {
		file: path1
			.split("\\")
			.filter((e) => e !== ".")
			.slice(0, -1),
		importUrl: path2.split("/").filter((e) => e !== "."),
	};

	const backwardsCount = splits.importUrl.filter((e) => e === "..").length;

	let importPath = "";

	if (backwardsCount > 0) {
		importPath = splits.file
			.slice(0, -1 * backwardsCount)
			.concat(splits.importUrl.slice(backwardsCount))
			.join("\\");
	} else {
		importPath = splits.file.concat(splits.importUrl).join("\\");
	}

	return importPath;
}

/**
 * 
 * @param {String} str 
 * @returns {String}
 */
function slashesToBackslashes(str) {
	return str.replace(/\//g, "\\");
}

module.exports = {
    getRecursivelyDirectoryFiles,
	getCombinedPath,
	slashesToBackslashes
}