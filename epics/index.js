import { combineEpics } from 'redux-observable';

import groupEpics from './groups';
import forumEpics from './forums';

export default combineEpics(...groupEpics, ...forumEpics);
