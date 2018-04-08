import 'whatwg-fetch';
import * as CODES from 'http-status-codes';


export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface CacheResult {
    [key: string]: any;
}
type Cache = {
    [method in HTTPMethod]: CacheResult;
};


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

// Wraps API calls, sets the JWT in headers, basename etc
export default class API {
    base: string;

    private _cache: Cache = {
        GET: {},
        POST: {},
        PUT: {},
        DELETE: {}
    };
    private _authHeader: string;

    constructor(base: string, authHeader: string = 'Authorization') {
        this.base = base;
        this._authHeader = authHeader;
    }


    get(url: string, cache: boolean = true, xhr: boolean = false) {
        // return this[xhr ? '_xhr' : '_fetch']('GET', url, null, cache);
        return this._fetch('GET', url, null, cache);
    }

    post(url: string, data: object, cache: boolean = false, xhr: boolean = false) {
        // return this[xhr ? '_xhr' : '_fetch']('POST', url, data, cache);
        return this._fetch('POST', url, data, cache);
    }

    put(url: string, data: object, cache: boolean = false, xhr: boolean = false) {
        // return this[xhr ? '_xhr' : '_fetch']('PUT', url, data, cache);
        return this._fetch('PUT', url, data, cache);
    }

    delete(url: string, data?: object, cache: boolean = false, xhr: boolean = false) {
        // return this[xhr ? '_xhr' : '_fetch']('DELETE', url, data, cache);
        return this._fetch('DELETE', url, data || null, cache);
    }

    get token(): string | null {
        return localStorage.getItem('token');
    }
    set token(v: string | null) {
        if (!v) localStorage.removeItem('token');
        else localStorage.setItem('token', v);
    }


    reset() {
        this.token = null;
        this._cache = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
    }


    updateCache(method: HTTPMethod, url: string, value: object) {
        const m = method.toUpperCase() as HTTPMethod;
        const cache = this._cache[m][url];

        if (cache) {
            this._cache[m][url] = value;

            return true;
        }
        return false;
    }


    private _fetch(method: HTTPMethod, url: string, data: object | null, cache: boolean): Promise<APIResponse> {
        if (cache && this._cache[method][url]) {
            return Promise.resolve(this._cache[method][url]);
        }

        interface conf extends RequestInit {
            headers: {
                [key: string]: any;
            };
        }
        const conf: conf = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (this.token && conf.headers) conf.headers[this._authHeader] = this.token;

        if (data) {
            if (data instanceof FormData) {
                conf.body = data;
                delete conf.headers['Content-Type'];
            } else conf.body = JSON.stringify(data);
        }

        return fetch(this.base + url, conf)
            .then(r => r.json())
            .then((res: APIResponse) => {
                if (res.statusCode >= CODES.BAD_REQUEST) {
                    interface ErrorWithCode extends Error {
                        code: number;
                    }
                    const err = new Error(res.message) as ErrorWithCode;
                    err.code = res.statusCode;

                    throw err;
                }
                if (cache || this._cache[method][url]) {
                    this._cache[method][url] = res;
                }

                return res;
            });
    }

    // private _xhr(method: HTTPMethod, url: string, data: object, cache: boolean): Promise<APIResponse> {
    //     const READYSTATE_OK = 4;
    //     const HTTP_OK = 200;

    //     interface PromiseWithTriggers extends Promise<APIResponse> {
    //         handlers: {
    //             [handler: string]: Function[]
    //         };
    //         _trigger(name: string, event: object): void;
    //         on(name: string, handler: Function): void;
    //     }

    //     const p: PromiseWithTriggers = new Promise((res, rej) => {
    //         if (!this.token) return rej(new Error('No JWT stored'));

    //         let formData = new FormData();

    //         if (data instanceof FormData) {
    //             formData = data;
    //         } else {
    //             for (const [name, val] of Object.entries(data)) formData.append(name, val);
    //         }

    //         const xhr = new XMLHttpRequest();
    //         // xhr.timeout = this.timeout;

    //         xhr.upload.addEventListener('progress', ({loaded, total}) => {
    //             p._trigger('progress', {
    //                 value: loaded,
    //                 max: total
    //             });
    //         });

    //         xhr.addEventListener('load', () => {
    //             p._trigger('progress', {
    //                 value: 100,
    //                 max: 100
    //             });
    //         });

    //         xhr.addEventListener('readystatechange', ({target}) => {
    //             if (xhr.readyState !== READYSTATE_OK) return;

    //             if (xhr.status !== HTTP_OK) {
    //                 return rej(new Error(xhr.status.toString()));
    //             }

    //             if (!target) return;

    //             const {response} = target;

    //             const result = JSON.parse(response);
    //             const {error} = result;

    //             if (error) {
    //                 rej(new Error(error));
    //             } else {
    //                 res(result);
    //             }
    //         });

    //         xhr.open(method, this.base + url);
    //         xhr.setRequestHeader(this._authHeader, this.token);

    //         xhr.send(formData);
    //     });

    //     p.handlers = {};
    //     p._trigger = (name, event) => {
    //         if (p.handlers[name]) {
    //             p.handlers[name].forEach(h => h(event));
    //         }
    //     };
    //     p.on = (name, handler) => {
    //         if (!p.handlers[name]) p.handlers[name] = [];

    //         p.handlers[name].push(handler);

    //         return p;
    //     };

    //     return p;
    // }
}
