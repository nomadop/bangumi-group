import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { usePayloadPath, handleFetchAction } from './common';
import { groupActions } from '../actions';

const receiveGroups = combineActions(groupActions.fetch.done, groupActions.refresh.done);

const groups = handleActions({
  [groupActions.fetch.done]: (state, { payload }) => state.concat(payload.groups),
  [groupActions.refresh.done]: usePayloadPath('groups'),
}, []);

const currentPage = handleActions({
  [receiveGroups]: usePayloadPath('currentPage'),
}, 0);

const endReached = handleActions({
  [receiveGroups]: usePayloadPath('endReached'),
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
