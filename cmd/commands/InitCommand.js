const Command = require("../Command");
const { cjsConfig } = require("../constants");
const { Prefix } = require("../defaults");
const { cjs } = require("../lib");

module.exports = class InitCommand extends Command {
    constructor() {
        super(["init"], (args, flags) => {
            cjs.initEmptyProject();
            cjsConfig.create();
    
            console.log(`${Prefix}Created new empty project`);
        });
    }
}
