import { createActions } from 'redux-actions';

import groupActions from './groups';
import forumActions from './forums';

module.exports = createActions({
  groupActions,
  forumActions,
});
