import * as CODES from 'http-status-codes';
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
    get(url, cache = true, xhr = false) {
        // return this[xhr ? '_xhr' : '_fetch']('GET', url, null, cache);
        return this._fetch('GET', url, null, cache);
    }
    post(url, data, cache = false, xhr = false) {
        // return this[xhr ? '_xhr' : '_fetch']('POST', url, data, cache);
        return this._fetch('POST', url, data, cache);
    }
    put(url, data, cache = false, xhr = false) {
        // return this[xhr ? '_xhr' : '_fetch']('PUT', url, data, cache);
        return this._fetch('PUT', url, data, cache);
    }
    delete(url, data, cache = false, xhr = false) {
        // return this[xhr ? '_xhr' : '_fetch']('DELETE', url, data, cache);
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
    _fetch(method, url, data, cache) {
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
        return fetch(this.base + url, conf)
            .then(r => r.json())
            .then((res) => {
            if (res.statusCode >= CODES.BAD_REQUEST) {
                const err = new Error(res.message);
                err.code = res.statusCode;
                throw err;
            }
            if (cache || this._cache[method][url]) {
                this._cache[method][url] = res;
            }
            return res;
        });
    }
}
