import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { usePayloadPath, handleFetchAction } from './common';
import { topicActions } from '../actions';

const receiveTopic = combineActions(topicActions.fetch.done, topicActions.refresh.done);

const content = handleActions({
  [receiveTopic]: usePayloadPath('content'),
}, null);

const reply = handleActions({
  [receiveTopic]: usePayloadPath('reply'),
}, []);

export const topicReducer = combineReducers({ content, reply });

const topics = handleActions({
  [receiveTopic]: (state, action) => ({
    ...state,
    [action.payload.id]: topicReducer(state[action.payload.id], action),
  }),
}, {});

const fetching = handleFetchAction(topicActions.fetch);

const refreshing = handleFetchAction(topicActions.refresh);

export default combineReducers({
  topics,
  fetching,
  refreshing,
});
