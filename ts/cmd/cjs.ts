import { CommandUtil } from "./utils/CommandUtil";
import { FileUtil } from "./utils/FileUtil";

const fs = require("fs");
const path = require('path');

(async () => {
    const flags = CommandUtil.getFlags(process.argv, {
        l: "layout",
        f: "force",
        d: "dir"
    });
    const args = CommandUtil.getArgumentsWithoutFlags(process.argv);

    if(args.length === 0) {
        // console.log(CommandUtil.getUsage());
        process.exit();
    }

    const commandName = args[0];
    
    const matches = FileUtil.getRecursivelyDirectoryFiles("./commands", ".js")
        .map(filepath => new (require(path.join(__dirname, filepath)))())
        .filter(command => command.names.map((e: string) => e.toLowerCase()).includes(commandName.toLowerCase()));

    const foundCommand = matches.length === 1;

    if(!foundCommand) {
        // console.log(getUsage());
        process.exit();
    }

    const command = matches[0];

    await command.execute(args.slice(1), flags);

    process.exit();
})();