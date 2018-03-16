import { combineReducers } from 'redux';
import { handleActions, combineActions } from 'redux-actions';
import { groupActions } from '../actions';

const groups = handleActions({
  [groupActions.fetch.done]: (state, { payload }) => state.concat(payload.groups),
}, []);

const currentPage = handleActions({
  [groupActions.fetch.done]: (state, { payload }) => payload.currentPage,
}, 0);

const endReached = handleActions({
  [groupActions.fetch.done]: (state, { payload }) => payload.endReached,
}, false);

const fetching = handleActions({
  [groupActions.fetch.start]: () => true,
  [combineActions(groupActions.fetch.done, groupActions.fetch.fail)]: () => false,
}, false);

export default combineReducers({
  groups,
  currentPage,
  endReached,
  fetching,
});