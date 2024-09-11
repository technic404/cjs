const fs = require('fs');

// const Relative = "../src";
const Relative = "../../../src";
const RootLayoutPath = `${Relative}/layouts/root/RootLayout.mjs`;

(async () => {
    const f = await import(RootLayoutPath);

    console.log(f);
    
})();

// console.log(fs.readFileSync(RootLayoutPath, { encoding: 'utf-8' }));
//