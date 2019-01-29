import { colors, error, info, success } from '@origami/core-lib';
import chalk from 'chalk';
import execa from 'execa';
import semver from 'semver';

type Type = 'major' | 'minor' | 'patch' | 'prerelease';
const type = process.argv[2] as Type;


// Loops over all packages, and syncs the versions to the LOCAL latest version
const publish = async () => {
  const { stdout: unclean } = await execa('git', ['status', '--porcelain']);
  if (unclean.trim().length) {
    console.log(chalk.red('\n\nUnclean working directory. Please commit all files before publishing'));
    console.log(chalk.red(unclean), '\n\n');
    process.exit(1);
  }

  const { stdout } = await execa('npx', ['lerna', 'list', '-pl']);
  const packages = stdout.split('\n').map((p) => {
    const [dir, name, version] = p.split(':');
    return { name, version, dir };
  });


  const newVerions = await Promise.all(packages.map(async (p) => {
    const curV = p.version;
    let newV;
    let tag;

    switch (type) {
      case 'major':
        newV = semver.inc(curV, type);
        tag = 'stable';
        break;
      case 'minor':
        newV = semver.inc(curV, type);
        tag = 'next';
        break;
      case 'patch':
        newV = semver.inc(curV, type);
        tag = 'latest';
        break;
      case 'prerelease':
        // @ts-ignore Is valid
        newV = semver.inc(curV, type, 'alpha');
        tag = 'alpha';
        break;
      default:
        throw new Error('Invalid release type');
    }

    // Update the versions
    await execa('yarn', ['version', '--new-version', newV!, '--no-git-tag-version'], {
      cwd: p.dir
    });

    return {
      ...p,
      version: newV,
      tag
    };
  }));

  const message = newVerions.reduce((m, {version, name, tag}) => {
    m += `  publishing ${name} -> v${version} @ ${tag} \n`;
    return m;
  }, '');


  await execa('git', ['add', '-A']);
  await execa('git', ['commit', '-m', 'chore: publishing new versions']);

  newVerions.forEach(async ({tag, dir, version, name}) => {

    info(colors.blue(`🚀 Publishing ${colors.yellow(name)} at version ${colors.yellow.bold(version!)} ${tag ? `🏷 ${tag}` : ''}`));
    const tagFlag = tag ? ['--tag', tag] : [];
    try {
      await execa(
        'yarn', ['publish', '--non-interactive', `--new-version=${version}`, ...tagFlag],
        { cwd: dir }
      );
      success('Success!');
    } catch (e) {
      error(e);
    }
  });
};

publish();
