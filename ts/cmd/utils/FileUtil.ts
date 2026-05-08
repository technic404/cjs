const fs = require("fs");
const path = require("path");

export const FileUtil = {
    getRecursivelyDirectoryFiles(dir: string, filter: string = "") {
        const files: string[] = [];
    
        fs.readdirSync(dir).forEach((file: string) => {
            const absolutePath = path.join(dir, file);
            const isDirectory = fs.statSync(absolutePath).isDirectory();
    
            if (!isDirectory && !file.endsWith(filter)) return;
    
            files.push(
                isDirectory
                    ? this.getRecursivelyDirectoryFiles(absolutePath, filter)
                    : absolutePath
            );
        });
    
        return files.flat();
    },
    
    /**
     * Combines a path, so if path1 is "./src/components/target/Target.mjs" and path2 is "../../parts/somePart/SomeHandler.mjs" the resulted path will be "./src/parts/somePart/SomeHandler.mjs"
     */
    getCombinedPath(path1: string, path2: string): string {
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
    },
    
    slashesToBackslashes(str: string): string {
        return str.replace(/\//g, "\\");
    },
    
    backslashesToSlashes(str: string): string {
        return str.replace(/\\/g, '/');
    }
};