import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { usePayload, usePayloadPath, handleFetchAction } from './common';
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

export const groupsReducer = combineReducers({
  groups,
  currentPage,
  endReached,
});

const fetching = handleFetchAction(groupActions.fetch);

const refreshing = handleFetchAction(groupActions.refresh);

const tag = handleActions({
  [groupActions.switchTag]: usePayload,
}, 'all');

const taggedGroups = handleActions({
  [receiveGroups]: (state, action) => ({
    ...state,
    [action.payload.tag]: groupsReducer(state[action.payload.tag], action),
  }),
}, {});

export default combineReducers({
  tag,
  taggedGroups,
  fetching,
  refreshing,
});
