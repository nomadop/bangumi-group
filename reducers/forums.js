import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';
import { forumActions } from '../actions';
import * as _ from 'lodash';

const topics = handleActions({
  [forumActions.fetch.done]: (state, { payload }) => state.concat(payload.topics),
}, []);

const currentPage = handleActions({
  [forumActions.fetch.done]: (state, { payload } ) => payload.currentPage,
}, 0);

const endReached = handleActions({
  [forumActions.fetch.done]: (state, { payload } ) => payload.endReached,
}, false);

const title = handleActions({
  [forumActions.fetch.done]: (state, { payload } ) => payload.title,
}, '');

const fetching = handleActions({
  [forumActions.fetch.start]: () => true,
  [combineActions(forumActions.fetch.done, forumActions.fetch.fail)]: () => false,
}, false);

export const forumReducer = combineReducers({ topics, currentPage, endReached, title, fetching });

export default handleActions({
  [combineActions(..._.values(forumActions.fetch))]: (state, action) => ({
    ...state,
    [action.payload.group]: forumReducer(state[action.payload.group], action),
  }),
}, {});
