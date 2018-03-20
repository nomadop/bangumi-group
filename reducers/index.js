import { combineReducers } from 'redux';

import groups from './groups';
import forums from './forums';
import topics from './topics';

export default combineReducers({
  groups,
  forums,
  topics,
});
