const { getUsage, getArgumentsWithoutFlags, getFlags } = require("./framework/utils/cmd");
const { getRecursivelyDirectoryFiles } = require('./compiler/src/utils/fileUtil');
const Command = require('./Command');
const path = require("path");

(async () => {
    const flags = getFlags(process.argv, {
        l: "layout",
        f: "force",
        d: "dir"
    });
    const args = getArgumentsWithoutFlags(process.argv);

    if(args.length === 0) {
        console.log(getUsage());
        process.exit();
    }

    /** @type {string} */
    const commandName = args[0];

    /** @type {Command[]} */
    const matches = getRecursivelyDirectoryFiles("./commands", ".js")
        .map(filepath => new (require(path.join(__dirname, filepath)))())
        .filter(command => command.names.map(e => e.toLowerCase()).includes(commandName.toLowerCase()));

    const foundCommand = matches.length === 1;

    if(!foundCommand) {
        console.log(getUsage());
        process.exit();
    }

    /** @type {Command} */
    const command = matches[0];

    await command.execute(args.slice(1), flags);

    process.exit();
})();