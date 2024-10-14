const Command = require("../Command");
const { Prefix, PrefixError } = require("../defaults");
const CjsNames = require("../framework/objects/CjsNames");
const CjsComponent = require("../framework/objects/creator/CjsComponent");
const CjsStyle = require("../framework/objects/creator/CjsStyle");
const CjsStyler = require("../framework/objects/modifier/CjsStyler");
const { capitalizeFirst } = require("../framework/utils/string");
const fs = require('fs');

module.exports = class StylerCommand extends Command {

    structure = {
        arguments: ["Component name"],
        flags: ["layout"]
    }

    constructor() {
        super("styler", async (args, flags) => {
            if(!args.length === 1) return this.logUsage();

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
        });
    }
}