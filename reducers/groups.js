import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { usePayloadPath, handleFetchAction } from './common';
import { groupActions } from '../actions';

const groups = handleActions({
  [groupActions.fetch.done]: (state, { payload }) => state.concat(payload.groups),
  [groupActions.refresh.done]: usePayloadPath('groups'),
}, []);

const currentPage = handleActions({
  [combineActions(groupActions.fetch.done, groupActions.refresh.done)]: usePayloadPath('currentPage'),
}, 0);

const endReached = handleActions({
  [combineActions(groupActions.fetch.done, groupActions.refresh.done)]: usePayloadPath('endReached'),
}, false);

const fetching = handleFetchAction(groupActions.fetch);

const refreshing = handleFetchAction(groupActions.refresh);

export default combineReducers({
  groups,
  currentPage,
  endReached,
  fetching,
  refreshing,
});
