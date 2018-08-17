import CODES, { NOT_FOUND } from 'http-status-codes';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ResponseType = 'json' | 'text';

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

    get(url: string, cache: boolean = true, type: ResponseType = 'json') {
        return this._fetch('GET', url, null, cache, type);
    }

    post(url: string, data: object, cache: boolean = false) {
        return this._fetch('POST', url, data, cache);
    }

    put(url: string, data: object, cache: boolean = false) {
        return this._fetch('PUT', url, data, cache);
    }

    delete(url: string, data?: object, cache: boolean = false) {
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


    private _fetch(
        method: HTTPMethod,
        url: string,
        data: object | null,
        cache: boolean,
        type: ResponseType = 'json'
    ): Promise<APIResponse> {
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


        const request = fetch(this.base + url, conf);
        let response;


        switch (type) {
            case 'text':
                response = request
                    .then(r => {
                        if (r.status === NOT_FOUND) return;
                        return r.text();
                    });
                break;


            case 'json':
            default:
                response = request
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
                        return res;
                    });
        }

        // Cache the request
        response = response.then(res => {
            if (cache || this._cache[method][url]) this._cache[method][url] = res;
            return res;
        });

        return response;
    }
}
