const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
let exec = require('child_process').exec;

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
exec = promisify(exec);

const getComponents = async() => {
    const cpath = path.resolve(__dirname, 'packages/components');
    let files = await readdir(cpath)
    files = files.map(async f => ((await stat(path.join(cpath, f))).isDirectory() && f))
    return (await Promise.all(files)).filter(f => f !== false)
};

(async () => {
    const components = await getComponents();
    components.forEach(async (c) => {
        console.log('Documenting', c);
        const {stderr: error} = await exec(`cd packages/components/${c}; wc-document ${c}.ts`);
        if (error) console.error(error);
    })
})();
