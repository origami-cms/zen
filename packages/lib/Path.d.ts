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
/**
 * Public API for matching a URL pathname to a path pattern.
 */
declare const matchPath: (pathname: string, options?: string | MatchPathOptions) => MatchResults | null;
export default matchPath;
