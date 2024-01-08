const passed1Args = require("./args/1");
const passed2Args = require("./args/2");
const { getUsage, getArgumentsWithoutFlags } = require("./args/arguments");

const availableArgs = [1, 2];

function command() {

    if(!availableArgs.includes(getArgumentsWithoutFlags(process.argv).length)) return console.log(getUsage())

    passed1Args(process);
    passed2Args(process);
}

command();