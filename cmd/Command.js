const { Prefix, Colors } = require("./defaults");

class Command {
    /** @type {string} Name of the command */
    name;

    /** @type {{ arguments: string[], flags: [] }} Usage of the command */
    structure = {
        arguments: [],
        flags: []
    };

    /** @type {function(string[], Object.<string, string>)} Executor of the commmand */
    execute;

    /**
     * @param {string} name 
     * @param {function(string[], Object.<string, string>)} execute
     */
    constructor(name, execute) {
        this.name = name;
        this.execute = execute;
    }

    logUsage() {
        if(this.structure.arguments.length > 0) {
            console.log(
                `${Prefix}Usage: ${Colors.yellow}${this.name} ` + 
                this.structure.arguments.map((e) => `${Colors.black}[${Colors.yellow}${e}${Colors.black}]${Colors.none}`)
            );
        }

        if(this.structure.flags.length > 0) {
            console.log(
                `Flags:\n` + 
                this.structure.flags.map((e) => `${Colors.yellow}--${e} ${Colors.black}...${Colors.none}`)
            );
        }
    }

    /**
     * Executes command function
     * @param {string[]} args 
     * @param {Object.<string, string>} flags 
     */
    execute(args, flags) {}
}

module.exports = Command;