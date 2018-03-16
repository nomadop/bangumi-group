import * as _ from 'lodash';

export const getGroups = state => _.sortBy(state.groups.groups, group => -Number.parseInt(group.feed));

export const getCurrentPage = state => state.groups.currentPage;

export const getEndReached = state => state.groups.endReached;

export const getFetching = state => state.groups.fetching;

export const getRefreshing = state => state.groups.refreshing;
