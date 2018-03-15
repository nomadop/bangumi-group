import { createActions } from 'redux-actions';

import groupActionMap from './groups';
import forumActionMap from './forums';

const actions = createActions({
  groupActions: groupActionMap,
  forumActions: forumActionMap,
});

export const { groupActions, forumActions } = actions;