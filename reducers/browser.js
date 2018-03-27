import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { browser as browserActions } from '../actions';
import { usePayload, fetchingReducer } from './common';

const uri = handleActions({
  [browserActions.setUri]: usePayload,
}, null);

const title = handleActions({
  [browserActions.setTitle]: usePayload,
}, null);

const loading = fetchingReducer(browserActions.load);

export default combineReducers({
  uri,
  title,
  loading,
});
