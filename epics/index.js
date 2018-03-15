import { combineEpics } from 'redux-observable';

import fetchGroups from './fetchGroups';
import fetchForum from './fetchForum';

export default combineEpics(fetchGroups, fetchForum);
