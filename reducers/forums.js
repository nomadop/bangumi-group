import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';
import { forumActions } from '../actions';
import * as _ from 'lodash';

const topics = handleActions({
  [forumActions.fetch.done]: (state, { payload }) => state.concat(payload.topics),
  [forumActions.refresh.done]: (state, { payload }) => payload.topics,
}, []);

const currentPage = handleActions({
  [combineActions(forumActions.fetch.done, forumActions.refresh.done)]: (state, { payload } ) => payload.currentPage,
}, 0);

const endReached = handleActions({
  [combineActions(forumActions.fetch.done, forumActions.refresh.done)]: (state, { payload } ) => payload.endReached,
}, false);

const title = handleActions({
  [forumActions.fetch.done]: (state, { payload } ) => payload.title,
}, '');

const fetching = handleActions({
  [forumActions.fetch.start]: () => true,
  [combineActions(forumActions.fetch.done, forumActions.fetch.fail)]: () => false,
}, false);

const refreshing = handleActions({
  [forumActions.refresh.start]: () => true,
  [combineActions(forumActions.refresh.done, forumActions.refresh.fail)]: () => false,
}, false);

export const forumReducer = combineReducers({ topics, currentPage, endReached, title, fetching, refreshing });

export default handleActions({
  [combineActions(..._.values(forumActions.fetch), ..._.values(forumActions.refresh))]: (state, action) => ({
    ...state,
    [action.payload.group]: forumReducer(state[action.payload.group], action),
  }),
}, {});
