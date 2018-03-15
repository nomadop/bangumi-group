import { createActions } from 'redux-actions';

import groupActionMap from './groups';
import forumActionMap from './forums';

const actions = createActions({
  GROUP_ACTIONS: groupActionMap,
  FORUM_ACTIONS: forumActionMap,
});

console.log(actions);

export const { groupActions, forumActions } = actions;