const { cjs } = require("./lib");
const { Prefix, PrefixError } = require("./defaults");
const { getUsage, getArgumentsWithoutFlags, getFlags } = require("./framework/utils/cmd");
const fs = require('fs');
const { cjsConfig } = require("./constants");
const CjsStyler = require("./framework/objects/modifier/CjsStyler");
const { capitalizeFirst } = require("./framework/utils/string");
const CjsNames = require("./framework/objects/CjsNames");
const CjsComponent = require("./framework/objects/creator/CjsComponent");
const CjsStyle = require("./framework/objects/creator/CjsStyle");

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
        styler: async (args, flags) => {
            const names = CjsNames.getNames(args[0], "component");
            const hasLayoutFlag = "layout" in flags && flags.layout !== null;
            const path = hasLayoutFlag
                ? `../src/layouts/${capitalizeFirst(flags.layout, false)}`
                : `../src/${names.camelStyle}`
            const component = new CjsComponent(names, path);
            const content = fs.readFileSync(component.getFilePath(), { encoding: 'utf-8' });
            const match = content.match(/return\s+`([^`]+)`;/);
            const hasReturnStatement = match && match[1];

            if(!hasReturnStatement) return console.log(`${PrefixError}Could not find the html return statement, unable to determinate styles`);

            const html = match[1].trim();
            const selectors = await CjsStyler.getSelectors(html);
            const hasSelectors = selectors.length !== 0;
            const style = new CjsStyle(names, path + "/styles");

            if(hasSelectors) console.log(`${Prefix}Successfully created selectors in style file`);

            fs.writeFileSync(style.getFilePath(), `${selectors.map(selector => {
                return `${selector} {\n    \n}`
            }).join("\n\n")}`);
        },
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