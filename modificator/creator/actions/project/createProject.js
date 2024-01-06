const fs = require('fs');

function createProject() {
    const dir = `../`;

    fs.cpSync(
        "./actions/project/schematics/default",
        dir,
        { recursive: true }
    );
}

module.exports = createProject;