import { combineReducers } from 'redux';

import groups from './groups';
import forums from './forums';

export default combineReducers({
  groups,
  forums,
});