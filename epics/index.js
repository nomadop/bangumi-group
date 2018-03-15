import { combineEpics } from 'redux-observable';

import fetchGroups from './fetchGroups';

export default combineEpics(fetchGroups);
