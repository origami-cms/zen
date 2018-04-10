import {Reducer, AnyAction} from 'redux';
import immutable, {ImmutableObject, ImmutableArray, ImmutableObjectMixin} from 'seamless-immutable';

export interface ResourceState {
    loadedInitial: boolean;
    loading: {
        all: boolean,
        single: boolean
    };
    errors: {
        get: boolean | string
    };
}
export interface State extends ImmutableObject<ResourceState> {
    [resource: string]: any;
}
export interface Resource {
    [key: string]: any;
}

export type ResourceStateMixin<S> = S & ResourceState;

export default (resource: string, func?: Function | null, key: string = 'id') => {
    const up = resource.toUpperCase();
    const singular = resource.slice(0, -1);


    const initialState = immutable({
        [resource]: immutable([]) as ImmutableArray<any>,
        loadedInitial: false,
        loading: {
            all: false,
            single: false
        },
        errors: {
            get: false
        }
    });

    return (state = initialState, action: AnyAction) => {
        const res = state[resource] as ImmutableArray<any>;
        const resourceList = res.asMutable();

        const findIndexByKey = (res: Resource) =>
            resourceList.findIndex(r => r[key] === res[key]);


        switch (action.type) {
            case `${up}_LOADING_SINGLE_START`:
                return state.setIn(['loading', 'single'], true);
            case `${up}_LOADING_SINGLE_END`:
                return state.setIn(['loading', 'single'], false);

            case `${up}_LOADING_ALL_START`:
                return state.setIn(['loading', 'all'], true);
            case `${up}_LOADING_ALL_END`:
                return state.setIn(['loading', 'all'], false);


            case `${up}_SET`:
                // If there is no resource, return state
                if (!action[resource]) return state;


                let updated = state;

                action[resource].forEach((res: Resource) => {
                    const existing = findIndexByKey(res);

                    // If there is an existing resource that matches the id,
                    // then update it
                    if (existing >= 0) {
                        updated = updated.setIn([resource, existing.toString()], {
                            ...res[existing],
                            ...res
                        });

                    // Otherwise merge the resource into the array
                    } else {
                        updated = updated.merge({
                            [resource]: [
                                ...updated[resource] as ImmutableArray<any>,
                                res
                            ],
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
                    resourceList.filter(u => u[key] !== action[key])
                );


            case `${up}_UPDATED`:
                const index = findIndexByKey(action[singular]);

                const s = state.setIn(
                    [resource, index.toString()],
                    {
                        ...res[index],
                        ...action[singular]
                    }
                );

                return s;


            case `${up}_GET_ERROR`:
                return state.setIn(['errors', 'get'], action.error);


            default:
                if (func) return func(state, action);
                return state;
        }
    };
};
