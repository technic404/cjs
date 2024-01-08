
const compile = require("../compiler/main");
const { Prefix } = require("../defaults");
const { cjs } = require("../lib");
const { getUsage, getArgumentsWithoutFlags } = require("./arguments");

const ActionTypes = {
    Init: "init", // initialized the c.js project
    Compile: "compile", // compile & compress project using cjs compiler
}

/**
 * 
 * @param {NodeJS.Process} process 
 */
async function passed1Args(process) {
    const args = getArgumentsWithoutFlags(process.argv);

    if(args.length !== 1) return;

    const actionType = args[0].toLowerCase();
    const passedUnknownArgument = !Object.values(ActionTypes).includes(actionType);

    if(passedUnknownArgument) return console.log(getUsage())

    switch (actionType) {
        case ActionTypes.Init:
            cjs.initEmptyProject();

            console.log(`${Prefix}Created new empty project`)
            break;
        case ActionTypes.Compile:
            await compile("../src", "../compiled");

            console.log(`${Prefix}Project compiled successfully`);
            break;
    }

    process.exit();
}

module.exports = passed1Args;