import { createActions } from 'redux-actions';

import groupActionMap from './groups';
import forumActionMap from './forums';
import topicActionMap from './topics';
import discoverActionMap from './discover';

const actions = createActions({
  GROUPS: groupActionMap,
  FORUMS: forumActionMap,
  TOPICS: topicActionMap,
  DISCOVER: discoverActionMap,
});

export const {
  groups,
  forums,
  topics,
  discover,
} = actions;
