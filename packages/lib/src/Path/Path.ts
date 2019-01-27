/**
 * Borrowed from React Router
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
 * All credit goes the the React Router maintainers
 */

import * as p2reg from 'path-to-regexp'; // } //   RegExpOptions //   Path, //   ParseOptions, //   Key, // , {

type CompilePathOptions = p2reg.RegExpOptions & p2reg.ParseOptions;

interface PatternCache {
  [cache: string]: CompiledPattern;
}

interface CompiledPattern {
  re?: RegExp;
  keys?: p2reg.Key[];
  [key: string]: any;
}

export interface MatchPathOptions {
  path?: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}

export interface MatchResults {
  path: string;
  url: string;
  isExact: boolean;
  params: MatchResultsParams;
}

export interface MatchResultsParams {
  [key: string]: any;
}

const patternCache: PatternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;

const compilePath = (
  pattern: p2reg.Path,
  options: CompilePathOptions
): CompiledPattern => {
  const p = pattern as string;
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const cache: CompiledPattern =
    patternCache[cacheKey] || (patternCache[cacheKey] = {} as CompiledPattern);

  if (cache[p]) {
    return cache[p];
  }

  const keys: p2reg.Key[] = [];
  const re = p2reg.default(pattern, keys, options);
  const compiledPattern: CompiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[p] = compiledPattern;
    cacheCount += 1;
  }

  return compiledPattern;
};

/**
 * Public API for matching a URL pathname to a path pattern.
 */
const matchPath = (
  pathname: string,
  options: string | MatchPathOptions = {}
): MatchResults | null => {
  const o = typeof options === 'string' ? { path: options } : options;

  const { path = '/', exact = false, strict = false, sensitive = false } = o;
  const { re, keys } = compilePath(path, { end: exact, strict, sensitive });

  const match = (re as RegExp).exec(pathname);

  if (!match) return null;

  const [url, ...values] = match;
  const isExact = pathname === url;

  if (exact && !isExact) return null;

  return {
    path, // The path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // The matched portion of the URL
    isExact, // Whether or not we matched exactly
    params: (keys as p2reg.Key[]).reduce(
      (memo, key, index) => {
        memo[key.name] = values[index];

        return memo;
      },
      {} as { [key: string]: any }
    )
  };
};

export default matchPath;
