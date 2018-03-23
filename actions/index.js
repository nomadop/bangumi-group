import { createActions } from 'redux-actions';

import groupActions from './groups';
import forumActions from './forums';
import topicActions from './topics';
import discoverActions from './discover';

const actions = createActions({
  GROUPS: groupActions,
  FORUMS: forumActions,
  TOPICS: topicActions,
  DISCOVER: discoverActions,
});

export const {
  groups,
  forums,
  topics,
  discover,
} = actions;
