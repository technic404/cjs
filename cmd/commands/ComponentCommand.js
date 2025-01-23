const Command = require("../Command");
const { Prefix, Colors } = require("../defaults");
const { cjs } = require("../lib");

module.exports = class ComponentCommand extends Command {

    structure = {
        arguments: ["Component name ..."],
        flags: ["layout", "dir"]
    }

    constructor() {
        super("component", async (args, flags) => {
            if(args.length < 1) return this.logUsage();

            for(const arg of args) {
                const component = cjs.creator.create("component", arg, flags);

                if(!component) return;

                console.log(`${Prefix}Successfully created ${Colors.yellow}${component.names.pascalCase} ${Colors.none}component`);
            }
        });
    }
}