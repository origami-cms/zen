import {singular as singularize} from 'pluralize';
import { AnyAction } from 'redux';
import Immutable, { ImmutableArray, ImmutableObject } from 'seamless-immutable';
export type ArrAny = ImmutableArray<any>;
export type ImmutableResourceState = ImmutableObject<ResourceState>;

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

export type ResourceStateMixin<S> = S & ResourceState;

// tslint:disable-next-line variable-name
export const APIReducer = (
  resource: string,
  func?: Function | null,
  key: string = 'id'
) => {
  const up = resource.toUpperCase();
  const singular = singularize(resource);

  const initialState = Immutable({
    [resource]: Immutable([]) as ArrAny,
    loadedInitial: false,
    _loading: {
      all: false,
      single: false,
      post: false,
      edit: false
    },
    _errors: {
      get: false,
      post: false,
      edit: false,
      delete: false
    }
  });

  return (state = initialState, action: AnyAction) => {
    const res = state[resource] as ArrAny;
    const resourceList = res.asMutable();

    const findIndexByKey = (_res: Resource) =>
      resourceList.findIndex((r) => r[key] === _res[key]);

    switch (action.type) {
      case `${up}_LOADING_SINGLE_START`:
        return state.setIn(['_loading', 'single'], true);
      case `${up}_LOADING_SINGLE_END`:
        return state.setIn(['_loading', 'single'], false);

      case `${up}_CREATING_START`:
        return state.setIn(['_loading', 'post'], true);
      case `${up}_CREATING_END`:
        return state.setIn(['_loading', 'post'], false);

      case `${up}_UPDATING_START`:
        return state.setIn(['_loading', 'edit'], true);
      case `${up}_UPDATING_END`:
        return state.setIn(['_loading', 'edit'], false);

      case `${up}_LOADING_ALL_START`:
        return state.setIn(['_loading', 'all'], true);
      case `${up}_LOADING_ALL_END`:
        return state.setIn(['_loading', 'all'], false);

      case `${up}_SET`:
        // If there is no resource, return state
        if (!action[resource]) return state;

        let updated = state;

        action[resource].forEach((_res: Resource) => {
          const existing = findIndexByKey(_res);

          // If there is an existing resource that matches the id,
          // then update it
          if (existing >= 0) {
            updated = updated.setIn([resource, existing.toString()], {
              ..._res[existing],
              ..._res
            });

            // Otherwise merge the resource into the array
          } else {
            updated = updated.merge({
              [resource]: [...(updated[resource] as ArrAny), _res],
              loadedInitial: true
            });
          }
        });

        return updated;

      case `${up}_CREATED`:
        resourceList.push(action[singular]);

        return state.set(resource, resourceList);

      case `${up}_REMOVED`:
        return state.set(
          resource,
          resourceList.filter((u) => u[key] !== action[key])
        );

      case `${up}_UPDATED`:
        const index = findIndexByKey(action[singular]);

        return state.setIn([resource, index.toString()], {
          ...res[index],
          ...action[singular]
        });

      case `${up}_CREATE_ERROR`:
        return state.setIn(['_errors', 'post'], action.error);
      case `${up}_GET_ERROR`:
        return state.setIn(['_errors', 'get'], action.error);
      case `${up}_UPDATE_ERROR`:
        return state.setIn(['_errors', 'edit'], action.error);
      case `${up}_REMOVED_ERROR`:
        return state.setIn(['_errors', 'delete'], action.error);

      default:
        if (func) return func(state, action);
        return state;
    }
  };
};
