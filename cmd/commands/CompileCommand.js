const Command = require("../Command");
const Compiler = require("../compiler/Compiler");
const { cjsConfig } = require("../constants");
const { Prefix } = require("../defaults");
const { normalizePath } = require("../framework/utils/files");

module.exports = class CompileCommand extends Command {
    constructor() {
        super(["compile"], async (args, flags) => {
            const output = normalizePath(cjsConfig.getUser().compiler.output);
            
            await Compiler.compile("../src", `../${output}`, "verbose" in flags);

            console.log(`\n${Prefix}Project compiled successfully`);
        });
    }
}
