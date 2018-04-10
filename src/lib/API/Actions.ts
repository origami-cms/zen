import _ from 'lodash';
import {Dispatch} from 'redux';
import {API, APIResource} from '.';

export default (name: string, API: API) => {
    const r = new APIResource(name, API).default();
    const funcs: {[name: string]: Function} = {};

    type f = 'create' | 'get' | 'update' | 'remove';
    (['create', 'get', 'update', 'remove'] as f[]).forEach(a => {
        funcs[`${name}${_.upperFirst(a)}`] = r[a];
    });

    funcs[`${name}SetGroupId`] = (groupId: string) =>
        (dispatch: Dispatch<any>) => dispatch({
            type: `${name}_GROUPID_SET`.toUpperCase(),
            groupId
        });

    return funcs;
};
