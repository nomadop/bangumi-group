import { combineReducers } from 'redux';

import groups from './groups';
import forums from './forums';
import topics from './topics';
import discover from './discover';

export default combineReducers({
  groups,
  forums,
  topics,
  discover,
});
