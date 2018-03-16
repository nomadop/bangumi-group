import { createSelector } from 'reselect';
import { forumReducer } from '../reducers/forums';

const getGroupState = (state, props) => state.forums.forums[props.match.params.name] || forumReducer(undefined, {});

export const getTopics = createSelector([getGroupState], state => state.topics);

export const getCurrentPage = createSelector([getGroupState], state => state.currentPage);

export const getEndReached = createSelector([getGroupState], state => state.endReached);

export const getTitle = createSelector([getGroupState], state => state.title);

export const getRefreshing = state => state.forums.refreshing;
