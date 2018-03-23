import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { usePayloadPath, fetchingReducer, fetchStatusReducer } from './common';
import { discover as discoverActions } from '../actions';

const hotGroups = handleActions({
  [discoverActions.fetch.done]: usePayloadPath('hotGroups'),
}, []);

const newGroups = handleActions({
  [discoverActions.fetch.done]: usePayloadPath('newGroups'),
}, []);

const topics = handleActions({
  [discoverActions.fetch.done]: usePayloadPath('topics'),
}, []);

const fetching = fetchingReducer(discoverActions.fetch);

const fetchStatus = fetchStatusReducer(discoverActions.fetch);

export default combineReducers({
  hotGroups,
  newGroups,
  topics,
  fetching,
  fetchStatus,
});
