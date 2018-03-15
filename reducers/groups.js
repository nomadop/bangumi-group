import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';
import { groupActions } from '../actions';

const groups = handleActions({
  [groupActions.fetchGroups.done]: (state, { payload }) => state.concat(payload.groups),
}, []);

const currentPage = handleActions({
  [groupActions.fetchGroups.done]: (state, { payload }) => payload.currentPage,
}, 0);

const endReached = handleActions({
  [groupActions.fetchGroups.done]: (state, { payload }) => payload.endReached,
}, false);

const fetching = handleActions({
  [groupActions.fetchGroups.start]: () => true,
  [combineActions(groupActions.fetchGroups.done, groupActions.fetchGroups.fail)]: () => false,
}, false);

export default combineReducers({
  groups,
  currentPage,
  endReached,
  fetching,
});