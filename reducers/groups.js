import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { usePayload, usePayloadPath, fetchingReducer, mapReducer } from './common';
import { groups as groupActions } from '../actions';

const groups = handleActions({
  [groupActions.fetch.done]: (state, { payload }) => state.concat(payload.groups),
}, []);

const currentPage = handleActions({
  [groupActions.fetch.done]: usePayloadPath('currentPage'),
}, 0);

const endReached = handleActions({
  [groupActions.fetch.done]: usePayloadPath('endReached'),
}, false);

export const groupsReducer = combineReducers({
  groups,
  currentPage,
  endReached,
});

const fetching = fetchingReducer(groupActions.fetch);

const tag = handleActions({
  [groupActions.switchTag]: usePayload,
}, 'all');

const taggedGroups = handleActions({
  [groupActions.fetch.done]: mapReducer(groupsReducer, usePayloadPath('tag')),
}, {});

export default combineReducers({
  tag,
  taggedGroups,
  fetching,
});
