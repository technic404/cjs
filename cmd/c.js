const { getUsage, getArgumentsWithoutFlags, getFlags } = require("./framework/utils/cmd");
const { getRecursivelyDirectoryFiles } = require('./compiler/src/utils/fileUtil');
const Command = require('./Command');

async function command() {
    const flags = getFlags(process.argv, {
        l: "layout",
        f: "force"
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
        .map(path => new (require(`.\\${path}`))())
        .filter(command => command.name.toLowerCase() === commandName.toLowerCase());

    const foundCommand = matches.length === 1;

    if(!foundCommand) {
        return console.log(getUsage());
    }

    /** @type {Command} */
    const command = matches[0];

    await command.execute(args.slice(1), flags);

    process.exit();
}

command();