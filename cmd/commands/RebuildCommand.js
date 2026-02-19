const Command = require("../Command");
const { Prefix, Colors, PrefixError } = require("../defaults");
const { cjs } = require("../lib");
const fs = require('fs');

module.exports = class RebuildCommand extends Command {

    structure = {
        arguments: ["library"],
        flags: []
    }

    constructor() {
        super(["rebuild"], async (args, flags) => {
            if(args.length !== 1) return this.logUsage();

            const option = args[0].toLowerCase()
            const match = {
                "library": () => fs.writeFileSync("../c.js", cjs.library.getContent(false))
            }
            const keys = Object.keys(match);

            if(!(option in match)) return console.log(`${PrefixError}Unknown option ${option}, available options: ${keys.join(", ")}`);

            const selected = match[option];

            selected();

            console.log(`${Prefix}Successfully rebuilded ${option}`);
        });
    }
}