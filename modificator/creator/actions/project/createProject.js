const fs = require('fs');
const { getFrameworkCompressedFiles } = require('../../../compiler/src/js/jsParser');

function createProject() {

    const frameworkContent = getFrameworkCompressedFiles();

    fs.cpSync(
        "./actions/project/schematics/default",
        dir,
        { recursive: true }
    );
}

module.exports = createProject;