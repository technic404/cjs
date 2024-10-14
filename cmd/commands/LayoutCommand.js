const Command = require("../Command");
const { Prefix, Colors } = require("../defaults");
const { cjs } = require("../lib");

module.exports = class LayoutCommand extends Command {

    structure = {
        arguments: ["Layout name ..."],
        flags: []
    }

    constructor() {
        super("layout", async (args, flags) => {
            if(args.length < 1) return this.logUsage();

            for(const arg of args) {
                const layout = cjs.creator.create("layout", arg, flags);

                if(!layout) return;

                console.log(`${Prefix}Successfully created ${Colors.yellow}${layout.names.pascalCase} ${Colors.none}layout`);
            }
        });
    }
}