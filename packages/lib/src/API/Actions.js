import lodash from 'lodash';
import { default as APIResource } from './Resource';
export default (name, API) => {
    const r = new APIResource(name, API).default();
    const funcs = {};
    ['create', 'get', 'update', 'remove'].forEach(a => {
        funcs[`${name}${lodash.upperFirst(a)}`] = r[a];
    });
    funcs[`${name}SetGroupId`] = (groupId) => (dispatch) => dispatch({
        type: `${name}_GROUPID_SET`.toUpperCase(),
        groupId
    });
    return funcs;
};
