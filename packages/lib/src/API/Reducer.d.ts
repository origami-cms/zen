/// <reference types="seamless-immutable" />
import { AnyAction } from 'redux';
import immutable, { ImmutableArray, ImmutableObject } from 'seamless-immutable';
export declare type ArrAny = ImmutableArray<any>;
export declare type ImmutableResourceState = ImmutableObject<ResourceState>;
export interface ResourceState {
    loadedInitial: boolean;
    _loading: {
        all: boolean;
        single: boolean;
        post: boolean;
        edit: boolean;
    };
    _errors: {
        get: boolean | string;
        post: boolean | string;
        edit: boolean | string;
        delete: boolean | string;
    };
}
export interface State extends ImmutableResourceState {
    [resource: string]: any;
}
export interface Resource {
    [key: string]: any;
}
export declare type ResourceStateMixin<S> = S & ResourceState;
declare const _default: (resource: string, func?: Function | null | undefined, key?: string) => (state: immutable.ImmutableObject<{
    [x: string]: boolean | immutable.ImmutableArray<any> | {
        all: boolean;
        single: boolean;
        post: boolean;
        edit: boolean;
        get?: undefined;
        delete?: undefined;
    } | {
        get: boolean;
        post: boolean;
        edit: boolean;
        delete: boolean;
        all?: undefined;
        single?: undefined;
    };
    loadedInitial: boolean;
    _loading: {
        all: boolean;
        single: boolean;
        post: boolean;
        edit: boolean;
    };
    _errors: {
        get: boolean;
        post: boolean;
        edit: boolean;
        delete: boolean;
    };
}> | undefined, action: AnyAction) => any;
export default _default;
