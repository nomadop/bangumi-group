import { handleActions, combineActions } from 'redux-actions';
import * as _ from 'lodash';

export const handleFetchAction = (fetchAction) => handleActions({
  [fetchAction.start]: () => true,
  [combineActions(fetchAction.done, fetchAction.fail)]: () => false,
}, false);

export const usePayload = (state, { payload }) => payload;

export const usePayloadPath = (path, defaultValue) => (state, { payload }) => _.get(payload, path, defaultValue);
