import CODES, { NOT_FOUND } from 'http-status-codes';
// Wraps API calls, sets the JWT in headers, basename etc
export default class API {
    constructor(base, authHeader = 'Authorization') {
        this._cache = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
        this.base = base;
        this._authHeader = authHeader;
    }
    get(url, cache = true, type = 'json') {
        return this._fetch('GET', url, null, cache, type);
    }
    post(url, data, cache = false, type = 'json') {
        return this._fetch('POST', url, data, cache, type);
    }
    put(url, data, cache = false) {
        return this._fetch('PUT', url, data, cache);
    }
    delete(url, data, cache = false) {
        return this._fetch('DELETE', url, data || null, cache);
    }
    get token() {
        return localStorage.getItem('token');
    }
    set token(v) {
        if (!v)
            localStorage.removeItem('token');
        else
            localStorage.setItem('token', v);
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
    updateCache(method, url, value) {
        const m = method.toUpperCase();
        const cache = this._cache[m][url];
        if (cache) {
            this._cache[m][url] = value;
            return true;
        }
        return false;
    }
    _fetch(method, url, data, cache, type = 'json') {
        if (cache && this._cache[method][url]) {
            return Promise.resolve(this._cache[method][url]);
        }
        const conf = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (this.token && conf.headers)
            conf.headers[this._authHeader] = this.token;
        if (data) {
            if (data instanceof FormData) {
                conf.body = data;
                delete conf.headers['Content-Type'];
            }
            else
                conf.body = JSON.stringify(data);
        }
        const request = fetch(this.base + url, conf);
        let response;
        switch (type) {
            case 'text':
                response = request
                    .then((r) => {
                    if (r.status === NOT_FOUND)
                        return;
                    return r.text();
                });
                break;
            case 'json':
            default:
                response = request
                    .then(r => r.json())
                    .then((res) => {
                    if (res.statusCode >= CODES.BAD_REQUEST) {
                        const err = new Error(res.message);
                        err.code = res.statusCode;
                        throw err;
                    }
                    return res;
                });
        }
        // Cache the request
        response = response.then((res) => {
            if (cache || this._cache[method][url])
                this._cache[method][url] = res;
            return res;
        });
        return response;
    }
}
