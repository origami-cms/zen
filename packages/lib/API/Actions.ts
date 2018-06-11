import {upperFirst} from 'lodash';
import {Dispatch} from 'redux';
import {default as API} from './API';
import {default as APIResource} from './Resource';

export default (name: string, API: API) => {
    const r = new APIResource(name, API).default();
    const funcs: {[name: string]: Function} = {};

    type f = 'create' | 'get' | 'update' | 'remove';
    (['create', 'get', 'update', 'remove'] as f[]).forEach(a => {
        funcs[`${name}${upperFirst(a)}`] = r[a];
    });

    funcs[`${name}SetGroupId`] = (groupId: string) =>
        (dispatch: Dispatch<any>) => dispatch({
            type: `${name}_GROUPID_SET`.toUpperCase(),
            groupId
        });

    return funcs;
};
