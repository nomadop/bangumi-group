import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { groupActions } from '../actions';

const groups = handleActions({
  [groupActions.addGroups]: (state, { payload }) => state.concat(payload),
}, []);

const currentPage = handleActions({
  [groupActions.nextPage]: state => state + 1,
}, 0);

const endReached = handleActions({
  [groupActions.reachEnd]: () => true,
}, false);

export default combineReducers({
  groups,
  currentPage,
  endReached,
});