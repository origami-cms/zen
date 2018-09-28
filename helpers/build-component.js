const {exec} = require('child_process');
const {performance} = require('perf_hooks');

// Runs a lerna task on a scoped package
const run = (func, scope) => new Promise((res, rej) => {
    console.log('Running', func, 'on package', scope);

    exec(`
        npx lerna run ${func} --scope @origamijs/${scope};
    `, (err) => {
        if (err) rej(err);
        else res();
    });
});

// Loops over all packages provided as command line args, and build them.
// Builds zen package at the end
(async() => {
    const start = performance.now();
    const [,, ...components] = process.argv;
    if (!components.length) throw new Error('No components provided');

    const tasks = components.map(c => new Promise(async res => {
        await run('build', `zen-${c}`);
        await run('rollup', `zen-${c}`);
        res();
    }));

    await Promise.all(tasks);

    await run('rollup', 'zen');
    const time = Math.round(((performance.now() - start) / 1000) * 100) / 100;
    console.log(`Completed in ${time}s`);
})();

