import * as _ from 'lodash';
import { createSelector } from 'reselect';

import { groupsReducer } from '../reducers/groups';

export const getTag = state => state.groups.tag;

const getTaggedGroups = state => state.groups.taggedGroups;

const getGroupsState = createSelector(
  [getTag, getTaggedGroups],
  (tag, taggedGroups) => taggedGroups[tag] || groupsReducer(undefined, {})
);

export const getGroups = createSelector(
  [getGroupsState],
  state => _.sortBy(state.groups, group => -Number.parseInt(group.feed))
);

export const getCurrentPage = createSelector([getGroupsState], state => state.currentPage);

export const getEndReached = createSelector([getGroupsState], state => state.endReached);

export const getFetching = state => state.groups.fetching;

export const getRefreshing = state => state.groups.refreshing;
