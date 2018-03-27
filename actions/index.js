import { createActions } from 'redux-actions';

import groupActions from './groups';
import forumActions from './forums';
import topicActions from './topics';
import discoverActions from './discover';
import browserActions from './browser';

const actions = createActions({
  GROUPS: groupActions,
  FORUMS: forumActions,
  TOPICS: topicActions,
  DISCOVER: discoverActions,
  BROWSER: browserActions,
});

export const {
  groups,
  forums,
  topics,
  discover,
  browser,
} = actions;
