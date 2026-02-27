const Command = require("../Command");
const { Prefix, Colors } = require("../defaults");
const { cjs } = require("../lib");

module.exports = class ComponentCommand extends Command {

    structure = {
        arguments: ["Requests collection name ..."],
        flags: []
    }

    constructor() {
        super(["requests", "rc"], async (args, flags) => {
            if(args.length < 1) return this.logUsage();

            for(const arg of args) {
                const requestsCollection = cjs.creator.create("requestsCollection", arg, flags);

                if(!requestsCollection) return;

                console.log(`${Prefix}Successfully created ${Colors.yellow}${requestsCollection.names.pascalCase} ${Colors.none}requests collection`);
            }
        });
    }
}