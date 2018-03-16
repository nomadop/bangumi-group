import { combineEpics } from 'redux-observable';

import { fetchGroups, refreshGroups } from './groups';
import { fetchForum, refreshForum } from './forums';

export default combineEpics(fetchGroups, refreshGroups, fetchForum, refreshForum);
