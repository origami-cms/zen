import { default as API } from './API';
export default class Resource {
    private _res;
    private _getSize;
    private _API;
    constructor(resource: string, API: API);
    readonly singular: string;
    readonly lower: string;
    readonly upper: string;
    default(): {
        create: (data: object) => (dispatch: Function) => Promise<void | object>;
        get: (id: string, cache: boolean, pagination: {}, qs: object) => (dispatch: Function) => Promise<void | object>;
        update: (id: string, data: object) => (dispatch: Function) => void;
        remove: (idOrArray: string | string[]) => (dispatch: Function) => void;
    };
    create(): (data: object) => (dispatch: Function) => Promise<void | object>;
    get(): (id: string, cache: boolean, pagination: {}, qs: object) => (dispatch: Function) => Promise<void | object>;
    update(): (id: string, data: object) => (dispatch: Function) => void;
    remove(): (idOrArray: string | string[]) => (dispatch: Function) => void;
    private _qs(...rest);
}
