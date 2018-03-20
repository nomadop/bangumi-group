import { createActions } from 'redux-actions';

import groupActionMap from './groups';
import forumActionMap from './forums';
import topicActionMap from './topics';

const actions = createActions({
  GROUP_ACTIONS: groupActionMap,
  FORUM_ACTIONS: forumActionMap,
  TOPIC_ACTIONS: topicActionMap,
});

export const { groupActions, forumActions, topicActions } = actions;
