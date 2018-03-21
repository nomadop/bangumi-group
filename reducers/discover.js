import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { usePayloadPath, handleFetchAction } from './common';
import { discoverActions } from '../actions';

const hotGroups = handleActions({
  [discoverActions.fetch.done]: usePayloadPath('hotGroups'),
}, []);

const newGroups = handleActions({
  [discoverActions.fetch.done]: usePayloadPath('newGroups'),
}, []);

const topics = handleActions({
  [discoverActions.fetch.done]: usePayloadPath('topics'),
}, []);

const fetching = handleFetchAction(discoverActions.fetch);

export default combineReducers({
  hotGroups,
  newGroups,
  topics,
  fetching,
});
