import { createActions } from 'redux-actions';

import groupActionMap from './groups';
import forumActionMap from './forums';
import topicActionMap from './topics';
import discoverActionMap from './discover';

const actions = createActions({
  GROUP_ACTIONS: groupActionMap,
  FORUM_ACTIONS: forumActionMap,
  TOPIC_ACTIONS: topicActionMap,
  DISCOVER_ACTIONS: discoverActionMap,
});

export const {
  groupActions,
  forumActions,
  topicActions,
  discoverActions,
} = actions;
