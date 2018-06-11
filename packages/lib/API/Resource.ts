import {default as API, APIPaginatedResponse} from './API';

export default class Resource {
    private _res: string;
    private _getSize: number = 50;
    private _API: API;

    constructor(resource: string, API: API) {
        this._res = resource;
        this._API = API;
    }

    get singular() { return this._res.slice(0, -1); }
    get lower() { return this._res.toLowerCase(); }
    get upper() { return this._res.toUpperCase(); }

    default() {
        return {
            create: this.create(),
            get: this.get(),
            update: this.update(),
            remove: this.remove()
        };
    }

    create() {
        return (data: object) =>
            (dispatch: Function) => {
                dispatch({type: `${this.upper}_CREATING_START`});

                return this._API.post(`/${this.lower}`, data)
                    .then(json => {
                        dispatch({
                            type: `${this.upper}_CREATED`,
                            [this.singular]: json.data
                        });
                        dispatch({type: `${this.upper}_CREATING_END`});

                        return json.data;
                    })
                    .catch((error: Error) => {
                        dispatch({type: `${this.upper}_CREATE_ERROR`, error});
                        dispatch({type: `${this.upper}_CREATING_END`});
                    });
            };
    }

    get() {
        interface Pagination {
            items?: number;
        }

        return (id: string, cache: boolean, pagination = {}, qs: object) =>
            (dispatch: Function) => {
                const loading = `${this.upper}_LOADING_${id ? 'SINGLE' : 'ALL'}_`;
                dispatch({type: `${loading}START`});

                const p: Pagination = pagination || {};
                if (!p.items) p.items = this._getSize;
                const _qs = this._qs(p, qs);

                return this._API.get(`/${this.lower}/${id || ''}${_qs}`, cache)
                    .then((json: APIPaginatedResponse) => {
                        const data = id ? [json.data] : json.data;
                        dispatch({
                            type: `${this.upper}_SET`,
                            [this.lower]: data,
                            _pages: json.pages,
                            _page: json.page,
                            _sort: json.sort,
                            _filter: json.filter
                        });
                        dispatch({type: `${loading}END`});

                        return data;
                    })
                    .catch(error => {
                        dispatch({type: `${this.upper}_GET_ERROR`, error});
                        dispatch({type: `${loading}END`});
                    });
            };
    }

    update() {
        return (id: string, data: object) =>
            (dispatch: Function) => {
                this._API.put(`/${this.lower}/${id}`, data)
                    .then(json => {
                        dispatch({type: `${this.upper}_UPDATED`, [this.singular]: json.data, id});

                        return json.data;
                    })
                    .catch(error => {
                        dispatch({type: `${this.upper}_UPDATE_ERROR`, error});
                    });
            };
    }

    remove() {
        return (idOrArray: string | string[]) =>
            (dispatch: Function) => {
                const run = (_id: string) => {
                    this._API.delete(`/${this.lower}/${_id}`)
                        .then(() => {
                            dispatch({type: `${this.upper}_REMOVED`, id: _id});
                        })
                        .catch(error => {
                            dispatch({type: `${this.upper}_REMOVED_ERROR`, error});
                        });
                };
                if (typeof idOrArray === 'string') run(idOrArray);
                else idOrArray.forEach(run);
            };
    }

    private _qs(...rest: object[]) {
        return `?${
            Object.entries(
                [...rest].reduce((combine, obj) => ({...combine, ...obj}), {})
            )
                .map(([key, value]) => `${key}=${value}`)
                .join('&')}`;
    }
}
