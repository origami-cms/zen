import 'whatwg-fetch';
export declare type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface APIResponse {
    statusCode: number;
    message: string;
    error?: string;
    data?: object;
}
export interface APIPaginatedResponse extends APIResponse {
    pages?: number;
    page?: number;
    sort?: string;
    filter?: string;
}
export default class API {
    base: string;
    private _cache;
    private _authHeader;
    constructor(base: string, authHeader?: string);
    get(url: string, cache?: boolean, xhr?: boolean): Promise<APIResponse>;
    post(url: string, data: object, cache?: boolean, xhr?: boolean): Promise<APIResponse>;
    put(url: string, data: object, cache?: boolean, xhr?: boolean): Promise<APIResponse>;
    delete(url: string, data?: object, cache?: boolean, xhr?: boolean): Promise<APIResponse>;
    token: string | null;
    reset(): void;
    updateCache(method: HTTPMethod, url: string, value: object): boolean;
    private _fetch(method, url, data, cache);
}
