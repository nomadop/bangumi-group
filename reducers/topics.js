import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { usePayloadPath, fetchingReducer, mapReducer } from './common';
import { topicActions } from '../actions';

const receiveTopic = combineActions(topicActions.fetch.done, topicActions.refresh.done);

const title = handleActions({
  [receiveTopic]: usePayloadPath('title'),
}, null);

const post = handleActions({
  [receiveTopic]: usePayloadPath('post'),
}, {});

const reply = handleActions({
  [receiveTopic]: usePayloadPath('reply'),
}, []);

export const topicReducer = combineReducers({ title, post, reply });

const topics = handleActions({
  [receiveTopic]: mapReducer(topicReducer, usePayloadPath('id'))
}, {});

const fetching = fetchingReducer(topicActions.fetch);

const refreshing = fetchingReducer(topicActions.refresh);

export default combineReducers({
  topics,
  fetching,
  refreshing,
});
