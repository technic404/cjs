const { cjs } = require("./lib");
const { Prefix, PrefixError } = require("./defaults");
const { getUsage, getArgumentsWithoutFlags, getFlags } = require("./framework/utils/cmd");
const fs = require('fs');
const { cjsConfig } = require("./constants");

/**
 * @type {Object.<number, Object.<string, function(string[], Object.<string, string>)>>}
 */
const commands = {
    1: {
        init: (args, flags) => {
            cjs.initEmptyProject(flags);
            cjsConfig.create();

            console.log(`${Prefix}Created new empty project`)
        },
        compile: async () => {
            await require("./compiler/main")("../src", "../compiled");

            console.log(`${Prefix}Project compiled successfully`);
        },
        config: () => {
            cjsConfig.create();
        }
    },
    2: {
        component: (args, flags) => {
            if(cjs.creator.create("component", args[0], flags)) {
                console.log(`${Prefix}Successfully created Component`)
            }
        },
        layout: (args) => {
            if(cjs.creator.create("layout", args[0])) {
                console.log(`${Prefix}Successfully created Layout`)
            }
        },
        rebuild: async (args) => {
            const option = args[0].toLowerCase()
            const match = {
                "library": () => fs.writeFileSync("../c.js", cjs.library.getContent(false))
            }
            const keys = Object.keys(match);

            if(!(option in match)) return console.log(`${PrefixError}Unknown option ${option}, available options: ${keys.join(", ")}`);

            const selected = match[option];

            selected();

            console.log(`${Prefix}Successfully rebuilded ${option}`);
        }
    }
}

async function command() {
    const flags = getFlags(process.argv, {
        l: "layout"
    });
    const args = getArgumentsWithoutFlags(process.argv);

    if(!(args.length in commands)) return console.log(getUsage());

    const commandsArgsCategory = commands[args.length];
    const firstCommand = args[0];

    if(!(firstCommand in commandsArgsCategory)) return console.log(getUsage());

    await commandsArgsCategory[firstCommand](args.slice(1), flags);

    process.exit();
}

command();