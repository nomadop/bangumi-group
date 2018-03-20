import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { usePayloadPath, handleFetchAction } from './common';
import { forumActions } from '../actions';

const receiveForum = combineActions(forumActions.fetch.done, forumActions.refresh.done);

const topics = handleActions({
  [forumActions.fetch.done]: (state, { payload }) => state.concat(payload.topics),
  [forumActions.refresh.done]: usePayloadPath('topics'),
}, []);

const currentPage = handleActions({
  [receiveForum]: usePayloadPath('currentPage'),
}, 0);

const endReached = handleActions({
  [receiveForum]: usePayloadPath('endReached'),
}, false);

const title = handleActions({
  [receiveForum]: usePayloadPath('title'),
}, '');

export const forumReducer = combineReducers({ topics, currentPage, endReached, title });

const forums = handleActions({
  [receiveForum]: (state, action) => ({
    ...state,
    [action.payload.group]: forumReducer(state[action.payload.group], action),
  }),
}, {});

const fetching = handleFetchAction(forumActions.fetch);

const refreshing = handleFetchAction(forumActions.refresh);

export default combineReducers({
  forums,
  fetching,
  refreshing,
});
