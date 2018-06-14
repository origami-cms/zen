/// <reference types="seamless-immutable" />
import { ImmutableObject } from 'seamless-immutable';
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
export interface State extends ImmutableObject<ResourceState> {
    [resource: string]: any;
}
export interface Resource {
    [key: string]: any;
}
export declare type ResourceStateMixin<S> = S & ResourceState;
declare const _default: (resource: string, func?: Function, key?: string) => (state: any, action: any) => any;
export default _default;
