import execa from 'execa';
import path from 'path';

const cwd = path.resolve(__dirname, '../../');

export interface LernaListOptions {
  include?: string[] | false;
  exclude?: string[];
}

export interface LernaListItem {
  name: string;
  version: string;
  location: string;
}

/**s
 * Return a list of lerna packages
 * @param filter Packages to exclude
 */
export const list = async (
  options: LernaListOptions
): Promise<LernaListItem[]> => {
  const { stdout } = await execa('lerna', ['list', '--json']);
  const parsed = JSON.parse(stdout) as LernaListItem[];
  const { exclude, include } = options;
  // Filter out unwanted packages
  let filtered = parsed.filter(
    ({ location }) => !(exclude || []).includes(location.split('/').pop()!)
  );

  if (include) {
    filtered = filtered.filter(({ name }) =>
    include.includes(
      name.split('/').pop()!
        // Slice of 'zen-'
        .slice(4)
      )
    );

  }

  return filtered;
};
