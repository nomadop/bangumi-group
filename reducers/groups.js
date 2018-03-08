import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { addGroups, nextPage } from '../actions/groups';

const groups = handleActions({
  [addGroups]: (state, { payload }) => state.concat(payload),
}, []);

const currentPage = handleActions({
  [nextPage]: state => state + 1,
}, 0);

export default combineReducers({
  groups,
  currentPage,
});