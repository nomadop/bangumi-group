import { combineEpics } from 'redux-observable';

import groupEpics from './groups';
import forumEpics from './forums';
import topicEpics from './topics';
import discoverEpics from './discover';

export default combineEpics(
  ...groupEpics,
  ...forumEpics,
  ...topicEpics,
  ...discoverEpics
);
