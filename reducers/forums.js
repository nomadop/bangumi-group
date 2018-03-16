import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';
import * as _ from 'lodash';

import { usePayloadPath, handleFetchAction } from './common';
import { forumActions } from '../actions';

const topics = handleActions({
  [forumActions.fetch.done]: (state, { payload }) => state.concat(payload.topics),
  [forumActions.refresh.done]: usePayloadPath('topics'),
}, []);

const currentPage = handleActions({
  [combineActions(forumActions.fetch.done, forumActions.refresh.done)]: usePayloadPath('currentPage'),
}, 0);

const endReached = handleActions({
  [combineActions(forumActions.fetch.done, forumActions.refresh.done)]: usePayloadPath('endReached'),
}, false);

const title = handleActions({
  [forumActions.fetch.done]: usePayloadPath('title'),
}, '');

const fetching = handleFetchAction(forumActions.fetch);

const refreshing = handleFetchAction(forumActions.refresh);

export const forumReducer = combineReducers({ topics, currentPage, endReached, title, fetching, refreshing });

export default handleActions({
  [combineActions(..._.values(forumActions.fetch), ..._.values(forumActions.refresh))]: (state, action) => ({
    ...state,
    [action.payload.group]: forumReducer(state[action.payload.group], action),
  }),
}, {});
