import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';
import { groupActions } from '../actions';

const groups = handleActions({
  [groupActions.fetch.done]: (state, { payload }) => state.concat(payload.groups),
  [groupActions.refresh.done]: (state, { payload }) => payload.groups,
}, []);

const currentPage = handleActions({
  [combineActions(groupActions.fetch.done, groupActions.refresh.done)]: (state, { payload }) => payload.currentPage,
}, 0);

const endReached = handleActions({
  [combineActions(groupActions.fetch.done, groupActions.refresh.done)]: (state, { payload }) => payload.endReached,
}, false);

const fetching = handleActions({
  [groupActions.fetch.start]: () => true,
  [combineActions(groupActions.fetch.done, groupActions.fetch.fail)]: () => false,
}, false);

const refreshing = handleActions({
  [groupActions.refresh.start]: () => true,
  [combineActions(groupActions.refresh.done, groupActions.refresh.fail)]: () => false,
}, false);

export default combineReducers({
  groups,
  currentPage,
  endReached,
  fetching,
  refreshing,
});