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

    const commandName = args[0];
    const commandsFiles = getRecursivelyDirectoryFiles("./commands", ".js");

    for(const commandFile of commandsFiles) {
        /** @type {Command} */
        const command = new (require(`.\\${commandFile}`))();
        
        if(command.name.toLowerCase() !== commandName.toLowerCase()) continue;
        
        await command.execute(args.slice(1), flags);
    }

    process.exit();
}

command();