const Command = require("../Command");
const { cjsConfig } = require("../constants");
const { Prefix } = require("../defaults");

module.exports = class ConfigCommand extends Command {
    constructor() {
        super(["config"], async (args, flags) => {
            cjsConfig.create();

            console.log(`${Prefix}Successfully created a config file`);
        });
    }
}