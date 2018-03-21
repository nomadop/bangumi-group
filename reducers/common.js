import { handleActions, combineActions } from 'redux-actions';
import * as _ from 'lodash';

export const fetchingReducer = (fetchAction) => handleActions({
  [fetchAction.start]: () => true,
  [combineActions(fetchAction.done, fetchAction.fail)]: () => false,
}, false);

export const fetchStatusReducer = (fetchAction) => handleActions({
  [fetchAction.start]: () => 'PENDING',
  [fetchAction.done]: () => 'COMPLETE',
  [fetchAction.fail]: () => 'ERROR',
}, 'NONE');

export const usePayload = (state, { payload }) => payload;

export const usePayloadPath = (path, defaultValue) => (state, { payload }) => _.get(payload, path, defaultValue);

export const mapReducer = (reducer, keyExtractor) => (state, action) => {
  const key = keyExtractor(state, action);
  return {
    ...state,
    [key]: reducer(state[key], action),
  };
};
