import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';
import { forumActions } from '../actions';
import * as _ from 'lodash';

const topics = handleActions({
  [forumActions.addTopics]: (state, { payload }) => state.concat(payload.topics),
}, []);

const currentPage = handleActions({
  [forumActions.nextPage]: state => state + 1,
}, 0);

const endReached = handleActions({
  [forumActions.reachEnd]: () => true,
}, false);

const title = handleActions({
  [forumActions.setTitle]: (state, { payload }) => payload.title,
}, '');

export const forumReducer = combineReducers({ topics, currentPage, endReached, title });
export default handleActions({
  [combineActions(..._.values(forumActions))]: (state, action) => ({
    ...state,
    [action.payload.group]: forumReducer(state[action.payload.group], action),
  }),
}, {});
