/// <reference types="seamless-immutable" />
import { AnyAction } from 'redux';
import immutable, { ImmutableObject } from 'seamless-immutable';
export interface ResourceState {
    loadedInitial: boolean;
    _loading: {
        all: boolean;
        single: boolean;
        post: boolean;
    };
    _errors: {
        get: boolean | string;
        post: boolean | string;
    };
}
export interface State extends ImmutableObject<ResourceState> {
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
        get?: undefined;
    } | {
        get: boolean;
        all?: undefined;
        single?: undefined;
    };
    loadedInitial: boolean;
    _loading: {
        all: boolean;
        single: boolean;
    };
    _errors: {
        get: boolean;
    };
}> | undefined, action: AnyAction) => any;
export default _default;
