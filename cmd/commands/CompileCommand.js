const Command = require("../Command");
const Compiler = require("../compiler/Compiler");
const { Prefix } = require("../defaults");

module.exports = class CompileCommand extends Command {
    constructor() {
        super("compile", async (args, flags) => {
            await Compiler.compile("../src", "../compiled");

            console.log(`${Prefix}Project compiled successfully`);
        });
    }
}
