import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { usePayload, usePayloadPath, fetchingReducer, mapReducer } from './common';
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

const fetching = fetchingReducer(groupActions.fetch);

const refreshing = fetchingReducer(groupActions.refresh);

const tag = handleActions({
  [groupActions.switchTag]: usePayload,
}, 'all');

const taggedGroups = handleActions({
  [receiveGroups]: mapReducer(groupsReducer, usePayloadPath('tag')),
}, {});

export default combineReducers({
  tag,
  taggedGroups,
  fetching,
  refreshing,
});
