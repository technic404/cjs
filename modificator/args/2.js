const createComponent = require("../creator/actions/component/createComponent");
const createLayout = require("../creator/actions/layout/createLayout");
const createPart = require("../creator/actions/part/createPart");
const { ElementTypes } = require("../creator/actions/schematic");
const { changeFirstLetterCapitalization } = require("../creator/src/utils/string");
const { Prefix } = require("../defaults");
const { cjs } = require("../lib");
const { getUsage, getArgumentsWithoutFlags, getFlags } = require("./arguments");

/**
 * 
 * @param {NodeJS.Process} process 
 */
function passed2Args(process) {
    const flags = getFlags(process.argv);
    const args = getArgumentsWithoutFlags(process.argv);

    if(args.length !== 2) return;

    const elementType = args[0].toLowerCase();

    if(!Object.values(ElementTypes).includes(elementType)) return console.log(getUsage())

    const rawName = args[1];
    const hasWrongEnding = rawName.toLowerCase().endsWith(elementType);
    const parsedName = (
        hasWrongEnding ?
            rawName.substring(0, rawName.length - elementType.length) :
            rawName
    );

    if(hasWrongEnding) {
        console.warn(`Name contains wrong ending, parsed ${changeFirstLetterCapitalization(elementType, true)} with name "${rawName}" to "${parsedName}"`)
    }

    const name = {
        camelStyle: changeFirstLetterCapitalization(parsedName, false),
        pascalCase: changeFirstLetterCapitalization(parsedName, true)
    };

    switch(elementType) {
        case ElementTypes.COMPONENT:
            // createComponent(name);
            cjs.creator.create("component", args[1])
            break;
        case ElementTypes.PART:
            // createPart(name, ("target" in flags ? flags.target : null));
            cjs.creator.create("part", args[1], { target: ("target" in flags ? flags.target : null) })
            break;
        case ElementTypes.LAYOUT:
            cjs.creator.create("layout", args[1])
            // createLayout(name);
            break;
    }

    console.log(`${Prefix}Created ${elementType} element`)
}

module.exports = passed2Args;