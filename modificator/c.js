const { Prefix } = require("./defaults");
const { getUsage, getArgumentsWithoutFlags, getFlags } = require("./framework/utils/cmd");
const { cjs } = require("./lib");

/**
 * @type {Object.<number, Object.<string, function(string[], Object.<string, string>)>>}
 */
const commands = {
    1: {
        init: () => {
            cjs.initEmptyProject();

            console.log(`${Prefix}Created new empty project`)
        },
        compile: async () => {
            await compile("../src", "../compiled");

            console.log(`${Prefix}Project compiled successfully`);
        }
    },
    2: {
        component: (args) => {
            if(cjs.creator.create("component", args[0])) {
                console.log(`${Prefix}Successfully created Component`)
            }
        },
        layout: (args) => {
            if(cjs.creator.create("layout", args[0])) {
                console.log(`${Prefix}Successfully created Layout`)
            }
        },
        part: (args, flags) => {
            if(cjs.creator.create("part", args[0], flags)) {
                console.log(`${Prefix}Successfully created Part`)
            }
        }
    }
}

function command() {
    const flags = getFlags(process.argv);
    const args = getArgumentsWithoutFlags(process.argv);

    if(!(args.length in commands)) return console.log(getUsage());

    const commandsArgsCategory = commands[args.length];
    const firstCommand = args[0];

    if(!(firstCommand in commandsArgsCategory)) return console.log(getUsage());

    commandsArgsCategory[firstCommand](args.slice(1), flags);
}

command();