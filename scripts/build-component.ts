import execa from 'execa';
import listr from 'listr';
import { list } from './lib/Lerna';

let include: string[] | false;
[, , ...include] = process.argv;
const exclude = ['lib'];

if (!include.length) include = false;

// Runs `yarn build` and `yarn rollup` on all components
(async () => {
  const packages = await list({ include, exclude });

  // packages = packages.slice(0, 3);

  const tasks = new listr(
    packages.map((p) => ({
      title: p.name,
      task: (ctx: any, task: any) =>
        new Promise(async (res, rej) => {
          task.output = 'Building typescript';

          // Sass-render
          task.output = 'Rendering SASS';
          await execa(
            'npx',
            [
              'sass-render',
              `./**/*.scss`,
              '--suffix=-css.ts',
              '-t',
              '../../css-template.ts',
              '-i',
              '../../node_modules'
            ],
            {
              cwd: p.location
            }
          ).catch(rej);

          // Build Typescript
          task.output = 'Building typescript';
          await execa('yarn', ['build'], {
            cwd: p.location
          }).catch(rej);

          // Rollup
          task.output = 'Rolling up';
          await execa('yarn', ['rollup'], {
            cwd: p.location
          }).catch(rej);

          res();
        })
    })),
    {
      concurrent: false
    }
  );

  tasks.run();
})();
