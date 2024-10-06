const fs = require('fs');
const { cjs } = require("./lib");
const { Prefix, PrefixError } = require("./defaults");
const { cjsConfig } = require("./constants");
const { getUsage, getArgumentsWithoutFlags, getFlags } = require("./framework/utils/cmd");
const { capitalizeFirst } = require("./framework/utils/string");
const CjsStyler = require("./framework/objects/modifier/CjsStyler");
const CjsNames = require("./framework/objects/CjsNames");
const CjsFontFaces = require("./framework/objects/modifier/CjsFontFaces");
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
            const Compiler = await require("./compiler/Compiler");

            await Compiler.compile("../src", "../compiled");

            console.log(`${Prefix}Project compiled successfully`);
        },
        config: () => {
            cjsConfig.create();
        },
        fontfaces: async (args, flags) => {
            const fontFiles = CjsFontFaces.getFontFiles();
            const isSuccess = CjsFontFaces.appendFontFaces(fontFiles);

            if(!isSuccess) return;

            console.log(`${Prefix}Successfully created font faces from ${fontFiles.length} files`);
        },
    },
    2: {
        styler: async (args, flags) => {
            const names = CjsNames.getNames(args[0], "component");
            const hasLayoutFlag = "layout" in flags && flags.layout !== null;
            const path = hasLayoutFlag
                ? `../src/layouts/${capitalizeFirst(flags.layout, false)}`
                : `../src/${names.camelStyle}`
            const component = new CjsComponent(names, path);

            if(!fs.existsSync(component.getFilePath())) return console.log(`${PrefixError}Component doesn't exists`)

            /**
             * @example
             * <div ${onClick(() => console.log('Hi!'))}>Some content</div>
             * // Will transform to:
             * <div>Some content</div>
             * @param {string} str 
             * @returns {string}
             */
            const removeJsExpressions = (str) => str.replace(/\$\{[^}]+\}/g, '');

            const content = removeJsExpressions(fs.readFileSync(component.getFilePath(), { encoding: 'utf-8' }));
            const match = content.match(/return\s+`([\s\S]*?)`/);
            const hasReturnStatement = match && match[1];

            if(!hasReturnStatement) return console.log(`${PrefixError}Couldn't find the html return statement, unable to determinate styles`);

            const html = match[1].trim();
            const selectors = await CjsStyler.getSelectors(html);
            const hasSelectors = selectors.length !== 0;
            const style = new CjsStyle(names, path + "/styles");
            const writeContent = `${selectors.map(selector => { return `${selector} {\n    \n}` }).join("\n\n")}`;
            const styleContent = fs.readFileSync(style.getFilePath(), { encoding: 'utf-8' });
            const isStyleContentEmtpy = styleContent.trim() === "";
            
            if(!isStyleContentEmtpy && !("force" in flags)) {
                return console.log(`${PrefixError}Style file is not empty, use flag --force or -f to overwrite it anyway.`);
            }

            if(hasSelectors) console.log(`${Prefix}Successfully created selectors in style file`);

            fs.writeFileSync(style.getFilePath(), writeContent);
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
        l: "layout",
        f: "force"
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