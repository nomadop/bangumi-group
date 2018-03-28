import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import groups from './groups';
import forums from './forums';
import topics from './topics';
import discover from './discover';
import browser from './browser';

export default combineReducers({
  groups,
  forums,
  topics,
  discover,
  browser,
  router: routerReducer,
});
