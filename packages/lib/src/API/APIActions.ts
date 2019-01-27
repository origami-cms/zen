import { Dispatch } from 'redux';
import { API } from './API';
import { APIResource } from './APIResource';

// tslint:disable-next-line variable-name
export const APIActions = (name: string, api: API) => {
  const r = new APIResource(name, api).default();
  const funcs: { [name: string]: Function } = {};

  type f = 'create' | 'get' | 'update' | 'remove';
  (['create', 'get', 'update', 'remove'] as f[]).forEach((a) => {
    const upper = `${a.charAt(0).toUpperCase()}${a.slice(1)}`;
    funcs[`${name}${upper}`] = r[a];
  });

  funcs[`${name}SetGroupId`] = (groupId: string) => (dispatch: Dispatch<any>) =>
    dispatch({
      type: `${name}_GROUPID_SET`.toUpperCase(),
      groupId
    });

  return funcs;
};
